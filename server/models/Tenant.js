const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tenant = sequelize.define('Tenant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Tenant name (e.g., "Government of Karnataka", "Delhi Municipal Corporation")'
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Unique tenant code (e.g., "KA", "DL-MCD")'
    },
    type: {
        type: DataTypes.ENUM('STATE', 'DISTRICT', 'MUNICIPAL', 'NATIONAL'),
        allowNull: false,
        comment: 'Type of government entity'
    },
    jurisdictionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Root jurisdiction for this tenant'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    subscriptionTier: {
        type: DataTypes.ENUM('BASIC', 'STANDARD', 'PREMIUM', 'ENTERPRISE'),
        defaultValue: 'STANDARD',
        comment: 'Subscription level (for SaaS pricing)'
    },
    maxUsers: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Maximum allowed users (null = unlimited)'
    },
    maxGrievancesPerMonth: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Monthly grievance limit (null = unlimited)'
    },
    features: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Enabled features for this tenant'
    },
    branding: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Custom branding (logo, colors, etc.)'
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional configuration'
    }
}, {
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['code'] },
        { fields: ['type'] },
        { fields: ['isActive'] },
        { fields: ['jurisdictionId'] }
    ]
});

module.exports = Tenant;
