const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const migrateAI = async () => {
    const queryInterface = sequelize.getQueryInterface();
    const table = 'Grievances';

    try {
        const description = await queryInterface.describeTable(table);

        if (!description.severityScore) {
            console.log('Adding severityScore...');
            await queryInterface.addColumn(table, 'severityScore', {
                type: DataTypes.INTEGER,
                defaultValue: 0
            });
        }

        if (!description.vectorEmbedding) {
            console.log('Adding vectorEmbedding...');
            await queryInterface.addColumn(table, 'vectorEmbedding', {
                type: DataTypes.JSON,
                allowNull: true
            });
        }

        if (!description.isDuplicate) {
            console.log('Adding isDuplicate...');
            await queryInterface.addColumn(table, 'isDuplicate', {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            });
        }

        if (!description.duplicateOf) {
            console.log('Adding duplicateOf...');
            await queryInterface.addColumn(table, 'duplicateOf', {
                type: DataTypes.INTEGER,
                allowNull: true
            });
        }

        if (!description.predictedSLA) {
            console.log('Adding predictedSLA...');
            await queryInterface.addColumn(table, 'predictedSLA', {
                type: DataTypes.DATE,
                allowNull: true
            });
        }

        console.log('AI Migration Completed Successfully.');

        // Sync new models
        await sequelize.sync({ alter: true });
        console.log('New AI Models Synced.');

    } catch (error) {
        console.error('Migration Failed:', error);
    } finally {
        await sequelize.close();
    }
};

migrateAI();
