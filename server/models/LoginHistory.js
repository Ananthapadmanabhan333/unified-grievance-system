const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoginHistory = sequelize.define('LoginHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deviceType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Approximate logic from IP'
    },
    status: {
        type: DataTypes.ENUM('Success', 'Failed', 'Suspicious'),
        defaultValue: 'Success'
    },
    method: {
        type: DataTypes.STRING, // 'OTP', 'Password', 'Biometric'
        defaultValue: 'OTP'
    }
}, {
    timestamps: true, // CreatedAt serves as login time
    updatedAt: false,
    indexes: [
        { fields: ['userId'] },
        { fields: ['createdAt'] } // Frequent range queries
    ]
});

module.exports = LoginHistory;
