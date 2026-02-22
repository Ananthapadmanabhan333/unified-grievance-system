const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatbotLog = sequelize.define('ChatbotLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    sessionId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Session identifier for conversation threading'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    query: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    intent: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Detected intent (e.g., FileGrievance, StatusCheck)'
    },
    sources: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'RAG citations or knowledge base references used'
    },
    feedback: {
        type: DataTypes.ENUM('Positive', 'Negative', 'None'),
        defaultValue: 'None'
    },
    latencyMs: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true,
    indexes: [
        { fields: ['sessionId'] },
        { fields: ['userId'] },
        { fields: ['intent'] },
        { fields: ['createdAt'] }
    ]
});

module.exports = ChatbotLog;
