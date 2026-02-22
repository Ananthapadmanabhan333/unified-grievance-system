const cron = require('node-cron');
const intelligenceService = require('./ai/intelligenceService');
const riskService = require('./ai/riskService');
const { Grievance } = require('../models');

const startScheduler = () => {
    console.log('[Scheduler] Background Jobs Initialized');

    // 1. Anomaly Detection - Run every hour
    cron.schedule('0 * * * *', async () => {
        try {
            await intelligenceService.detectAnomalies();
        } catch (err) {
            console.error('[Scheduler] Anomaly Detection Failed:', err);
        }
    });

    // 2. Risk Update - Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
        console.log('[Scheduler] Updating Risk Scores...');
        try {
            const activeGrievances = await Grievance.findAll({
                where: { status: ['Pending', 'In Progress'] }
            });
            for (const g of activeGrievances) {
                await riskService.predictBreachRisk(g.id);
            }
        } catch (err) {
            console.error('[Scheduler] Risk Update Failed:', err);
        }
    });
};

module.exports = { startScheduler };
