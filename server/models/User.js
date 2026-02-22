const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tenantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Multi-tenant isolation'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true, // Made optional for Phone-first auth
        unique: true,
        validate: { isEmail: true }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true, // Initially true, but we will enforce it for new users
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Citizen', 'Department Officer', 'Department Head', 'Admin', 'SuperAdmin', 'StateAdmin', 'DistrictAdmin'),
        defaultValue: 'Citizen'
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    jurisdictionId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    aadhaarHash: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Encrypted Aadhaar hash for privacy'
    },
    verificationStatus: {
        type: DataTypes.ENUM('Unverified', 'Mobile Verified', 'Jurisdiction Verified', 'Fully Verified'),
        defaultValue: 'Unverified'
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Account active status'
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last successful login timestamp'
    },
    lastLoginIP: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Last login IP address for security tracking'
    },
    failedLoginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Failed login counter for account lockout'
    },
    lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Account lock expiry time'
    },
    passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last password change timestamp'
    },
    preferences: {
        type: DataTypes.JSON,
        allowNull: true
    },
    karmaPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Civic engagement score'
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'JWT refresh token'
    }
}, {
    timestamps: true,
    paranoid: true, // Soft delete support
    indexes: [
        { fields: ['email'] },
        { fields: ['phone'] },
        { fields: ['role'] },
        { fields: ['departmentId'] },
        { fields: ['jurisdictionId'] },
        { fields: ['tenantId'] },
        { fields: ['isActive'] },
        { fields: ['verificationStatus'] }
    ]
});

module.exports = User;

