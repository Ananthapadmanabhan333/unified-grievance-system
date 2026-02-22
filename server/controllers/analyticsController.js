const { Grievance, Department, User, Jurisdiction } = require('../models');
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

exports.getGovernanceStats = async (req, res) => {
    try {
        const { role, id, departmentId, jurisdictionId } = req.user;
        let grievanceFilter = {};
        let userFilter = {}; // To filter by submitter's jurisdiction

        // 1. Citizen: Only own grievances
        if (role === 'Citizen') {
            grievanceFilter.userId = id;
        }
        // 2. Dept Officials: Only own Department
        else if (role === 'Department Officer' || role === 'Department Head') {
            if (!departmentId) return res.status(403).json({ error: 'Officer not assigned to a department' });
            grievanceFilter.departmentId = departmentId;
        }
        // 3. Geographic Admins (State/District)
        else if (role === 'StateAdmin') {
            if (jurisdictionId) {
                const childJurisdictions = await Jurisdiction.findAll({ where: { parentId: jurisdictionId } });
                const ids = childJurisdictions.map(j => j.id).concat(jurisdictionId);
                userFilter.jurisdictionId = { [Op.in]: ids };
            }
        }
        else if (role === 'DistrictAdmin' || role === 'DistrictCollector') {
            if (jurisdictionId) {
                userFilter.jurisdictionId = jurisdictionId;
            }
        }

        const commonInclude = [{
            model: User,
            as: 'submitter',
            attributes: [],
            where: userFilter
        }];

        // 1. Department Wise Performance
        const deptStats = await Grievance.findAll({
            where: grievanceFilter,
            attributes: [
                'departmentId',
                [Sequelize.fn('COUNT', Sequelize.col('Grievance.id')), 'total'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END")), 'resolved'],
                [Sequelize.fn('AVG', Sequelize.col('sentimentScore')), 'avgSentiment']
            ],
            include: [
                { model: Department, attributes: ['name'] },
                ...commonInclude
            ],
            group: ['departmentId', 'Department.id']
        });

        // 2. SLA Compliance
        // Note: For accurate count with include, we need distinctive count or careful query.
        // Sequelize count with include works by joining.
        const slaStats = await Grievance.count({
            where: {
                ...grievanceFilter,
                status: 'Resolved',
                updatedAt: { [Op.lte]: Sequelize.col('slaDeadline') }
            },
            include: commonInclude
        });
        const totalResolved = await Grievance.count({
            where: { ...grievanceFilter, status: 'Resolved' },
            include: commonInclude
        });

        // 3. Recent Critical Issues
        const criticalIssues = await Grievance.findAll({
            where: {
                ...grievanceFilter,
                priority: 'Critical',
                status: { [Op.ne]: 'Resolved' }
            },
            limit: 5,
            include: [
                { model: Department, attributes: ['name'] },
                {
                    model: User,
                    as: 'submitter',
                    attributes: ['name', 'jurisdictionId'],
                    where: userFilter
                }
            ]
        });

        res.json({
            departmentPerformance: deptStats,
            slaCompliance: {
                compliant: slaStats,
                totalResolved: totalResolved,
                percentage: totalResolved > 0 ? ((slaStats / totalResolved) * 100).toFixed(1) : 0
            },
            criticalPending: criticalIssues
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCommandCenterData = async (req, res) => {
    try {
        // 1. Efficiency Scoring (Department Wise)
        // Formula: (Resolution Rate * 0.7) + (SLA Compliance * 0.3)
        const deptStats = await Grievance.findAll({
            attributes: [
                'departmentId',
                [Sequelize.fn('COUNT', Sequelize.col('Grievance.id')), 'total'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END")), 'resolved'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'Resolved' AND updatedAt <= slaDeadline THEN 1 ELSE 0 END")), 'slaCompliant']
            ],
            include: [{ model: Department, attributes: ['name', 'code'] }],
            group: ['departmentId', 'Department.id']
        });

        const efficiencyScores = deptStats.map(d => {
            const total = parseInt(d.getDataValue('total'));
            const resolved = parseInt(d.getDataValue('resolved'));
            const slaCompliant = parseInt(d.getDataValue('slaCompliant'));

            if (total === 0) return { ...d.toJSON(), score: 100, grade: 'A' };

            const resRate = (resolved / total) * 100;
            const slaRate = (slaCompliant / (resolved || 1)) * 100;

            const score = (resRate * 0.7) + (slaRate * 0.3);
            let grade = 'D';
            if (score >= 90) grade = 'A';
            else if (score >= 80) grade = 'B';
            else if (score >= 60) grade = 'C';

            return {
                department: d.Department.name,
                code: d.Department.code,
                total,
                score: score.toFixed(1),
                grade
            };
        }).sort((a, b) => b.score - a.score);

        // 2. Heatmap Data (By Jurisdiction)
        // Join with User to get Jurisdiction info
        const heatmapData = await Grievance.findAll({
            attributes: [
                [Sequelize.col('submitter.jurisdictionId'), 'jurisdictionId'],
                [Sequelize.fn('COUNT', Sequelize.col('Grievance.id')), 'intensity']
            ],
            include: [{
                model: User,
                as: 'submitter',
                attributes: [],
                include: [{ model: Jurisdiction, attributes: ['name', 'type'] }]
            }],
            group: ['submitter.jurisdictionId', 'submitter.Jurisdiction.id', 'submitter.Jurisdiction.name', 'submitter.Jurisdiction.type'],
            raw: true
        });

        // Map raw result to clean format
        // Sequelize raw result with nested includes can be tricky, relying on col references
        // We might need to fetch Jurisdictions separately or handle raw output keys like 'submitter.Jurisdiction.name'

        // 3. Trend Data (Last 7 Days)
        const SevenDaysAgo = new Date();
        SevenDaysAgo.setDate(SevenDaysAgo.getDate() - 7);

        const trendData = await Grievance.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            where: {
                createdAt: { [Op.gte]: SevenDaysAgo }
            },
            group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']]
        });

        res.json({
            efficiencyScores,
            heatmapData, // Frontend will map IDs to Names if needed or we use the raw result keys
            trendData
        });

    } catch (error) {
        console.error('Command Center Error:', error);
        res.status(500).json({ error: error.message });
    }
};
