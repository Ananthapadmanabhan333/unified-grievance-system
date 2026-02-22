const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jurisdiction = sequelize.define('Jurisdiction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('National', 'State', 'District', 'Ward/Block'),
        allowNull: false
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true // Root (National) has no parent
    },
    code: {
        type: DataTypes.STRING,
        unique: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Jurisdiction active status'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional data (population, area, coordinates, etc.)'
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['code'] },
        { fields: ['type'] },
        { fields: ['parentId'] },
        { fields: ['isActive'] }
    ]
});

module.exports = Jurisdiction;

