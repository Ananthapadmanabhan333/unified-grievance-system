const { ChatbotLog, sequelize } = require('../models');

const sync = async () => {
    try {
        await ChatbotLog.sync({ force: true }); // Use force to be sure, it's empty anyway
        console.log('ChatbotLog Table Synced.');
    } catch (e) {
        console.error('Sync Failed:', e);
    } finally {
        await sequelize.close();
    }
};

sync();
