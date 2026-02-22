const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GrievanceStatusLog = sequelize.define('GrievanceStatusLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    grievanceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fromStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Previous status (null for initial submission)'
    },
    toStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'New status'
    },
    changedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'User ID who made the change (null for system actions)'
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isSystemAction: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'True if changed by automated system (SLA escalation, etc.)'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional context (escalation level, assignment changes, etc.)'
    }
}, {
    timestamps: true,
    updatable: false, // Immutable - once created, cannot be updated
    indexes: [
        { fields: ['grievanceId'] },
        { fields: ['changedBy'] },
        { fields: ['toStatus'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = GrievanceStatusLog;
