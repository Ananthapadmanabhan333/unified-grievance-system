const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const migrateUser = async () => {
    const queryInterface = sequelize.getQueryInterface();
    const table = 'Users';

    try {
        const description = await queryInterface.describeTable(table);

        if (!description.karmaPoints) {
            console.log('Adding karmaPoints...');
            await queryInterface.addColumn(table, 'karmaPoints', {
                type: DataTypes.INTEGER,
                defaultValue: 0
            });
        }
        console.log('User Migration Completed.');
    } catch (error) {
        console.error('Migration Failed:', error);
    } finally {
        await sequelize.close();
    }
};

migrateUser();
