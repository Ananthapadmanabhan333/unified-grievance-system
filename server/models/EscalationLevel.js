const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EscalationLevel = sequelize.define('EscalationLevel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        comment: '0=Officer, 1=Dept Head, 2=District Admin, 3=State Admin, 4=Central Admin'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    roleRequired: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Role that handles this escalation level'
    },
    slaExtensionHours: {
        type: DataTypes.INTEGER,
        defaultValue: 24,
        comment: 'Additional hours granted when escalated to this level'
    },
    notificationTemplate: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Template for escalation notification'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['level'] },
        { fields: ['roleRequired'] }
    ]
});

module.exports = EscalationLevel;
