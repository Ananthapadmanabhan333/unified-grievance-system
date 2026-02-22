const { Grievance, ActionLog, User, Department, SLAConfig, Jurisdiction } = require('../models');
const aiService = require('../services/aiService');
const { Op } = require('sequelize');

// Helper to map Category -> Department Code
const getDeptCodeByCategory = (category) => {
    const map = {
        'Roads': 'RNI',
        'Potholes': 'RNI',
        'Street Light': 'PWR',
        'No Power': 'PWR',
        'Electricity': 'PWR',
        'Water Supply': 'JAL',
        'Water Leakage': 'JAL',
        'Sanitation': 'JAL',
        'Garbage': 'JAL'
    };
    return map[category] || 'RNI';
};

exports.predictCategory = async (req, res) => {
    try {
        const { description } = req.body;
        const result = await aiService.classify(description);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createGrievance = async (req, res) => {
    try {
        const { title, description, category, location, priority, images } = req.body;
        const userId = req.user.id;

        // 1. Identify Department
        const deptCode = getDeptCodeByCategory(category);
        const department = await Department.findOne({ where: { code: deptCode } });

        if (!department) {
            return res.status(400).json({ error: 'Invalid Category: No matching Department found' });
        }

        // 2. AI Analysis
        const sentiment = aiService.analyzeSentiment(description); // -1 to 1
        const aiClass = await aiService.classify(description);
        const riskLevel = await aiService.predictRisk(department.id);

        // 3. Fetch SLA Config & Adjust based on AI Risk
        const slaConfig = await SLAConfig.findOne({ where: { category, priority } });
        let slaHours = slaConfig ? slaConfig.resolutionTimeHours : department.slaHours;

        // Dynamic SLA Adjustment: High Risk Dept -> +24h buffer
        if (riskLevel === 'High') slaHours += 24;

        const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

        // 4. Create Grievance
        const grievance = await Grievance.create({
            title,
            description,
            category,
            priority,
            location,
            images,
            userId,
            departmentId: department.id,
            status: 'Pending',
            slaDeadline,
            escalationLevel: 0,
            // AI Fields
            aiClassification: aiClass,
            sentimentScore: sentiment,
            riskLevel: riskLevel,
            predictedSLA: slaDeadline
        });

        // 5. Log Action
        await ActionLog.create({
            grievanceId: grievance.id,
            performedBy: userId,
            action: 'SUBMISSION',
            details: `Grievance submitted. Assigned to ${department.name}. SLA: ${slaHours}h. AI Risk: ${riskLevel}`
        });

        res.status(201).json(grievance);
    } catch (error) {
        console.error('Create Grievance Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllGrievances = async (req, res) => {
    try {
        const { role, id, departmentId, jurisdictionId } = req.user;
        let where = {};
        let userFilter = {}; // To filter by submitter's jurisdiction

        // 1. Citizen: Only own grievances
        if (role === 'Citizen') {
            where.userId = id;
        }
        // 2. Dept Officials: Only own Department
        else if (role === 'Department Officer' || role === 'Department Head') {
            if (!departmentId) return res.status(403).json({ error: 'Officer not assigned to a department' });
            where.departmentId = departmentId;
        }
        // 3. Geographic Admins (State/District)
        else if (role === 'StateAdmin') {
            // Fetch all child jurisdictions (Districts)
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
        // 4. SuperAdmin: Sees ALL (no filters)

        const grievances = await Grievance.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'submitter',
                    attributes: ['name', 'email', 'phone', 'jurisdictionId'],
                    where: userFilter // Apply Jurisdiction Filter here
                },
                { model: Department, attributes: ['name', 'code'] },
                { model: User, as: 'assignee', attributes: ['name'] }
            ],
            order: [
                ['priority', 'DESC'], // Critical first
                ['slaDeadline', 'ASC'] // Closest deadline first
            ]
        });
        res.json(grievances);
    } catch (error) {
        console.error('Fetch Grievances Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const grievance = await Grievance.findByPk(req.params.id);

        if (!grievance) return res.status(404).json({ error: 'Grievance not found' });

        // Authorization Check: Only assigned Dept or Admin can update
        // (Skipping strict ownership check for now to allow any officer of dept to pick up)
        if (req.user.role !== 'Admin' && req.user.role !== 'SuperAdmin') {
            if (grievance.departmentId !== req.user.departmentId) {
                return res.status(403).json({ error: 'Unauthorized: Not your department' });
            }
        }

        const oldStatus = grievance.status;
        grievance.status = status;

        if (status === 'Resolved' || status === 'Rejected') {
            grievance.closureRemarks = remarks;
        }

        await grievance.save();

        await ActionLog.create({
            grievanceId: grievance.id,
            performedBy: req.user.id,
            action: 'STATUS_UPDATE',
            details: `Status changed from ${oldStatus} to ${status}. Remarks: ${remarks || 'None'}`,
            prevStatus: oldStatus,
            newStatus: status
        });

        res.json(grievance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
