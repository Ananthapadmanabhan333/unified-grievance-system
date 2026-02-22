const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grievance = sequelize.define('Grievance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uniqueId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: 'Human-readable tracking number (e.g., GRV-2025-001234)'
    },
    tenantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Multi-tenant isolation'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Citizen who submitted the grievance'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    grievanceCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'FK to GrievanceCategory master table'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved', 'Escalated', 'Rejected'),
        defaultValue: 'Pending'
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Medium'
    },
    location: {
        type: DataTypes.JSON, // { lat: 123, lng: 456, address: "xyz" }
        allowNull: true
    },
    images: {
        type: DataTypes.JSON // Array of image URLs
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    assignedTo: {
        type: DataTypes.INTEGER, // User ID of the officer
        allowNull: true
    },
    slaDeadline: {
        type: DataTypes.DATE,
        allowNull: true
    },
    escalationLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    closureRemarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp when grievance was resolved'
    },
    // AI Fields
    aiClassification: {
        type: DataTypes.JSON, // { suggestedCategory: "Roads", confidence: 0.85 }
        allowNull: true
    },
    sentimentScore: {
        type: DataTypes.FLOAT, // -1.0 to 1.0
        allowNull: true
    },
    riskLevel: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Low'
    },
    severityScore: {
        type: DataTypes.INTEGER, // 0-100
        defaultValue: 0,
        comment: 'AI-calculated severity score'
    },
    vectorEmbedding: {
        type: DataTypes.JSON, // Vector array for semantic search
        allowNull: true,
        comment: 'Semantic vector embedding'
    },
    isDuplicate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    duplicateOf: {
        type: DataTypes.INTEGER, // ID of original grievance
        allowNull: true
    },
    predictedSLA: {
        type: DataTypes.DATE, // AI adjusted SLA based on load
        allowNull: true
    },
    // Citizen Feedback
    citizenRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 5 },
        comment: 'Citizen satisfaction rating (1-5)'
    },
    citizenFeedback: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Citizen feedback after resolution'
    }
}, {
    timestamps: true,
    paranoid: true, // Soft delete support
    indexes: [
        { fields: ['uniqueId'] },
        { fields: ['userId'] },
        { fields: ['tenantId'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['departmentId'] },
        { fields: ['assignedTo'] },
        { fields: ['grievanceCategoryId'] },
        { fields: ['slaDeadline'] },
        { fields: ['escalationLevel'] },
        { fields: ['createdAt'] },
        { fields: ['status', 'priority'] }, // Composite index for common queries
        { fields: ['departmentId', 'status'] } // Composite index
    ],
    hooks: {
        beforeCreate: async (grievance) => {
            // Auto-generate unique tracking ID
            const year = new Date().getFullYear();
            const count = await sequelize.models.Grievance.count({
                where: {
                    createdAt: {
                        [sequelize.Sequelize.Op.gte]: new Date(year, 0, 1)
                    }
                }
            });
            grievance.uniqueId = `GRV-${year}-${String(count + 1).padStart(6, '0')}`;
        }
    }
});

module.exports = Grievance;

