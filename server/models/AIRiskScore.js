const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIRiskScore = sequelize.define('AIRiskScore', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    grievanceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    riskScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '0-100 Score indicating probability of SLA breach or escalation'
    },
    factors: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'List of contributing factors (e.g., High Workload, Repeat Offender)'
    },
    predictionTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    modelVersion: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['grievanceId'] },
        { fields: ['riskScore'] }
    ]
});

module.exports = AIRiskScore;
