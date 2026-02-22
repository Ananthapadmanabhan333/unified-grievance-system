const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const migratePreferences = async () => {
    const queryInterface = sequelize.getQueryInterface();
    const table = 'Users';

    try {
        const description = await queryInterface.describeTable(table);

        if (!description.preferences) {
            console.log('Adding preferences column...');
            await queryInterface.addColumn(table, 'preferences', {
                type: DataTypes.JSON,
                allowNull: true
            });
            console.log('Preferences Column Added.');
        } else {
            console.log('Preferences Column already exists.');
        }
    } catch (error) {
        console.error('Migration Failed:', error);
    } finally {
        await sequelize.close();
    }
};

migratePreferences();
