const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActionLog = sequelize.define('ActionLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    grievanceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    performedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING, // e.g., "STATUS_CHANGE", "COMMENT", "ASSIGNMENT"
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT // Human readable description
    },
    prevStatus: {
        type: DataTypes.STRING
    },
    newStatus: {
        type: DataTypes.STRING
    }
});

module.exports = ActionLog;
