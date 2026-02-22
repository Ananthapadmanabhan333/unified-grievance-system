const { AIRiskScore, AIInsight, AICluster, AIPrediction, sequelize } = require('../models');

const syncAll = async () => {
    try {
        console.log('Syncing AIRiskScore...');
        await AIRiskScore.sync({ alter: true });

        console.log('Syncing AIInsight...');
        await AIInsight.sync({ alter: true });

        console.log('Syncing AICluster...');
        await AICluster.sync({ alter: true });

        console.log('Syncing AIPrediction...');
        await AIPrediction.sync({ alter: true });

        console.log('All AI Tables Synced Successfully.');
    } catch (e) {
        console.error('Sync Failed:', e);
    } finally {
        await sequelize.close();
    }
};

syncAll();
