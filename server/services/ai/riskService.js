const { Grievance, AIRiskScore } = require('../../models');
const { Op } = require('sequelize');

const riskService = {
    /**
     * Predict Probability of SLA Breach (Batch or On-Demand)
     */
    predictBreachRisk: async (grievanceId) => {
        const grievance = await Grievance.findByPk(grievanceId);
        if (!grievance) return;

        let riskScore = 0;
        let factors = [];

        // 1. Time Remaining
        const now = new Date();
        const deadline = new Date(grievance.slaDeadline);
        const hoursLeft = (deadline - now) / (1000 * 60 * 60);

        if (hoursLeft < 0) {
            riskScore = 100;
            factors.push('SLA Breached');
        } else if (hoursLeft < 24) {
            riskScore += 50;
            factors.push('Less than 24h remaining');
        }

        // 2. Department Load
        const activeCount = await Grievance.count({
            where: {
                departmentId: grievance.departmentId,
                status: 'In Progress'
            }
        });

        if (activeCount > 50) {
            riskScore += 30;
            factors.push('High Department Workload');
        }

        // 3. Complexity (Category-based)
        if (['Engine', 'Infrastructure', 'Legal'].includes(grievance.category)) {
            riskScore += 20;
            factors.push('Complex Category');
        }

        // Cap at 100
        riskScore = Math.min(riskScore, 100);

        // Save prediction
        await AIRiskScore.create({
            grievanceId: grievance.id,
            riskScore,
            factors: factors
        });

        return { riskScore, factors };
    }
};

module.exports = riskService;
