const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIInsight = sequelize.define('AIInsight', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.ENUM('Anomaly', 'Trend', 'Performance', 'Policy'),
        allowNull: false
    },
    scope: {
        type: DataTypes.ENUM('National', 'State', 'District', 'Department'),
        allowNull: false
    },
    scopeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the State/District/Dept if applicable'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Supporting data points or visualization config'
    },
    severity: {
        type: DataTypes.ENUM('Critical', 'High', 'Medium', 'Info'),
        defaultValue: 'Info'
    },
    isDismissed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    generatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['type'] },
        { fields: ['scope'] },
        { fields: ['severity'] },
        { fields: ['generatedAt'] }
    ]
});

module.exports = AIInsight;
