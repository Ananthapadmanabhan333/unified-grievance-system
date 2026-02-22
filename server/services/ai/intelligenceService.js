const { Grievance, AIInsight, Department, Jurisdiction } = require('../../models');
const { Op } = require('sequelize');

const intelligenceService = {
    /**
     * Detect anomalies in grievance submission rates
     */
    detectAnomalies: async () => {
        console.log('[AI] Running Anomaly Detection...');

        // 1. Get daily average per district (last 30 days)
        const jurisdictions = await Jurisdiction.findAll({ where: { type: 'District' } });

        for (const district of jurisdictions) {
            // Get today's count
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const todayCount = await Grievance.count({
                where: {
                    location: { [Op.like]: `%${district.name}%` }, // Naive location match for MVP
                    createdAt: { [Op.gte]: startOfDay }
                }
            });

            // Get historical average (Mocked for MVP, usually SQL aggregation)
            const historicalAvg = 10; // Assume 10/day is normal

            // Threshold: 200% spike
            if (todayCount > historicalAvg * 2) {
                await AIInsight.create({
                    type: 'Anomaly',
                    scope: 'District',
                    scopeId: district.id,
                    title: `Spike in ${district.name}`,
                    description: `Grievances increased by ${((todayCount / historicalAvg) * 100).toFixed(0)}% today.`,
                    severity: 'High',
                    data: { today: todayCount, avg: historicalAvg }
                });
                console.log(`[AI] Anomaly Detected in ${district.name}`);
            }
        }
    },

    /**
     * Generate Daily Trends Report
     */
    generateTrends: async () => {
        // ... (Logic to aggregate top categories)
    }
};

module.exports = intelligenceService;
