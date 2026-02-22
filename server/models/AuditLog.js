const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'User who performed the action (null for system actions)'
    },
    userRole: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Role of the user at the time of action'
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Action performed (CREATE, UPDATE, DELETE, LOGIN, etc.)'
    },
    entityType: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Type of entity affected (Grievance, User, Department, etc.)'
    },
    entityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the affected entity'
    },
    oldValues: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous values before change'
    },
    newValues: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'New values after change'
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'IP address of the user'
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Browser/client user agent'
    },
    requestMethod: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'HTTP method (GET, POST, PUT, DELETE, etc.)'
    },
    requestUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'API endpoint accessed'
    },
    statusCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'HTTP response status code'
    },
    errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error message if action failed'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional context (tenant ID, jurisdiction, etc.)'
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false, // We use custom timestamp field
    updatable: false, // IMMUTABLE - audit logs can never be modified
    indexes: [
        { fields: ['userId'] },
        { fields: ['action'] },
        { fields: ['entityType'] },
        { fields: ['entityId'] },
        { fields: ['timestamp'] },
        { fields: ['ipAddress'] }
    ]
});

module.exports = AuditLog;
