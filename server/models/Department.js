const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
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
    slaHours: {
        type: DataTypes.INTEGER, // Default SLA in hours for this department
        defaultValue: 48
    }
});

module.exports = Department;
