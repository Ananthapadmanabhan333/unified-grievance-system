const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SLAConfig = sequelize.define('SLAConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    resolutionTimeHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 48
    },
    escalationTimeHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 24 // Time after which it escalates if no action taken
    }
});

module.exports = SLAConfig;
