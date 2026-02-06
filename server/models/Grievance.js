const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grievance = sequelize.define('Grievance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        type: DataTypes.STRING // e.g., Roads, Sanitation
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
        type: DataTypes.STRING
    },
    slaDeadline: {
        type: DataTypes.DATE
    },
    images: {
        type: DataTypes.JSON // Array of image URLs
    }
});

module.exports = Grievance;
