const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CitizenProfile = sequelize.define('CitizenProfile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        unique: true
    },
    // Personal Identity
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Transgender', 'Other'),
        allowNull: true
    },
    nationality: {
        type: DataTypes.STRING,
        defaultValue: 'Indian'
    },
    bloodGroup: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Identity Documents (Encrypted)
    aadhaarEncrypted: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'AES-256 Encrypted Aadhaar Number'
    },
    aadhaarMasked: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Display version (XXXX-XXXX-1234)'
    },

    // Address & Jurisdiction
    addressLine1: {
        type: DataTypes.STRING,
        allowNull: true
    },
    addressLine2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        defaultValue: 'Delhi'
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    wardNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Media
    photoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Emergency
    emergencyContactName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emergencyContactPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Meta
    verificationLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0: None, 1: Mobile, 2: Profile, 3: Address, 4: Govt ID
        comment: 'Numeric verification score'
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['userId'] },
        { fields: ['district'] },
        { fields: ['wardNumber'] }
    ]
});

module.exports = CitizenProfile;
