const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const migrateAIClassification = async () => {
    const queryInterface = sequelize.getQueryInterface();
    const table = 'Grievances';

    try {
        const description = await queryInterface.describeTable(table);

        if (!description.aiClassification) {
            console.log('Adding aiClassification column...');
            await queryInterface.addColumn(table, 'aiClassification', {
                type: DataTypes.JSON,
                allowNull: true,
                comment: 'AI-generated classification details'
            });
            console.log('aiClassification Column Added.');
        } else {
            console.log('aiClassification Column already exists.');
        }
    } catch (error) {
        console.error('Migration Failed:', error);
    } finally {
        await sequelize.close();
    }
};

migrateAIClassification();
