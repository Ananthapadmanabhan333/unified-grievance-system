const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIPrediction = sequelize.define('AIPrediction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    grievanceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    predictionType: {
        type: DataTypes.ENUM('CATEGORY_CLASSIFICATION', 'SENTIMENT_ANALYSIS', 'SLA_BREACH_PREDICTION', 'PRIORITY_SUGGESTION', 'DEPARTMENT_ROUTING'),
        allowNull: false
    },
    inputData: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Input data used for prediction (text, features, etc.)'
    },
    prediction: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Prediction result (category, sentiment score, breach probability, etc.)'
    },
    confidence: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Confidence score (0.0 to 1.0)'
    },
    modelVersion: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Version of the AI model used'
    },
    modelName: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Name of the AI model/algorithm used'
    },
    processingTimeMs: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Time taken for prediction in milliseconds'
    },
    wasAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        comment: 'Whether the prediction was accepted by user/system'
    },
    actualValue: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Actual value for accuracy tracking (filled later)'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Additional metadata (features, intermediate results, etc.)'
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['grievanceId'] },
        { fields: ['predictionType'] },
        { fields: ['modelVersion'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = AIPrediction;
