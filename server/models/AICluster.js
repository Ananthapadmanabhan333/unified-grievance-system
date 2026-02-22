const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AICluster = sequelize.define('AICluster', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Auto-generated topic/theme for the cluster'
    },
    centroid: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Vector centroid or representative features of the cluster'
    },
    grievanceCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Number of grievances in this cluster'
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Department this cluster belongs to (if specific)'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Resolved', 'Archived'),
        defaultValue: 'Active'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['topic'] },
        { fields: ['status'] },
        { fields: ['departmentId'] }
    ]
});

module.exports = AICluster;
