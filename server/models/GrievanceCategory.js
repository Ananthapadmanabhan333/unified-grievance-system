const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GrievanceCategory = sequelize.define('GrievanceCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Default department for this category'
    },
    defaultPriority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    defaultSLAHours: {
        type: DataTypes.INTEGER,
        defaultValue: 48,
        comment: 'Default resolution time in hours'
    },
    escalationLevel1Hours: {
        type: DataTypes.INTEGER,
        defaultValue: 24,
        comment: 'Hours before escalation to Level 1 (Dept Head)'
    },
    escalationLevel2Hours: {
        type: DataTypes.INTEGER,
        defaultValue: 48,
        comment: 'Hours before escalation to Level 2 (District Admin)'
    },
    escalationLevel3Hours: {
        type: DataTypes.INTEGER,
        defaultValue: 72,
        comment: 'Hours before escalation to Level 3 (State Admin)'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Icon name for UI display'
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Color code for UI display'
    }
}, {
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
        { fields: ['departmentId'] },
        { fields: ['code'] },
        { fields: ['isActive'] }
    ]
});

module.exports = GrievanceCategory;
