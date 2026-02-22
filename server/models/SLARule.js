const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SLARule = sequelize.define('SLARule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
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
        defaultValue: 48
    },
    escalationLevel1Hours: { // To Dept Head
        type: DataTypes.INTEGER,
        defaultValue: 24
    },
    escalationLevel2Hours: { // To District Admin
        type: DataTypes.INTEGER,
        defaultValue: 48
    }
});

module.exports = SLARule;
