const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
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
        allowNull: false,
        unique: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    headUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    slaHours: {
        type: DataTypes.INTEGER,
        defaultValue: 48
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Department active status'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true,
    indexes: [
        { fields: ['code'] },
        { fields: ['tenantId'] },
        { fields: ['isActive'] },
        { fields: ['headUserId'] }
    ]
});

module.exports = Department;

