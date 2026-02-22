const sequelize = require('../config/database');
const CitizenProfile = require('../models/CitizenProfile');
const LoginHistory = require('../models/LoginHistory');

const migrate = async () => {
    try {
        console.log('🔄 Starting Profile Schema Migration...');

        // Use sync() instead of alter to force creation if missing
        // This is safe for NEW tables.
        // For existing tables, we'd use queryInterface via migrations, but these ARE new.

        await CitizenProfile.sync({ alter: false });
        console.log('✅ CitizenProfile table created/verified.');

        await LoginHistory.sync({ alter: false });
        console.log('✅ LoginHistory table created/verified.');

        console.log('Migration Complete.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration Failed:', error);
        process.exit(1);
    }
};

migrate();
