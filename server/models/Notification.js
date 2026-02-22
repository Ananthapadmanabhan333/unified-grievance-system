const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Recipient user ID'
    },
    grievanceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Related grievance (if applicable)'
    },
    type: {
        type: DataTypes.ENUM(
            'GRIEVANCE_SUBMITTED',
            'STATUS_CHANGED',
            'ASSIGNED',
            'SLA_WARNING',
            'SLA_BREACH',
            'ESCALATED',
            'COMMENT_ADDED',
            'RESOLVED',
            'REJECTED',
            'SYSTEM_ALERT'
        ),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    channel: {
        type: DataTypes.ENUM('IN_APP', 'EMAIL', 'SMS', 'PUSH'),
        defaultValue: 'IN_APP'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    readAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    sentAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When notification was actually sent (for email/SMS)'
    },
    deliveryStatus: {
        type: DataTypes.ENUM('PENDING', 'SENT', 'DELIVERED', 'FAILED'),
        defaultValue: 'PENDING'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional data (action links, related IDs, etc.)'
    }
}, {
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['userId'] },
        { fields: ['grievanceId'] },
        { fields: ['type'] },
        { fields: ['isRead'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = Notification;
