const sequelize = require('../config/database');

const check = async () => {
    try {
        const [results, metadata] = await sequelize.query("PRAGMA table_info(AIPredictions);");
        console.log('Columns in AIPredictions:', results.map(c => c.name));
    } catch (e) {
        console.error('Check Failed:', e);
    } finally {
        await sequelize.close();
    }
};

check();
