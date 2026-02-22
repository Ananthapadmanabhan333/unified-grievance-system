const fs = require('fs');
const path = require('path');
const natural = require('natural');
const { Grievance, ChatbotLog } = require('../../models');

// Load Knowledge Base
const kbPath = path.join(__dirname, '../../data/knowledgeBase.json');
let knowledgeBase = [];
try {
    knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
} catch (e) {
    console.error('Failed to load Knowledge Base:', e);
}

// Safety Filters (Restricted Topics)
const BLOCKED_TOPICS = [
    'legal advice', 'lawsuit', 'sue', 'court case',
    'political party', 'vote', 'politics', 'minister',
    'medical advice', 'doctor', 'treatment',
    'investment', 'stock', 'money'
];

const chatbotService = {
    /**
     * Process user message and return response
     */
    processMessage: async (userId, message, context = {}) => {
        const lowerMsg = message.toLowerCase();
        let responseText = "I'm sorry, I didn't understand that. I can help with finding information, checking status, or explaining SLAs.";
        let intent = 'Unknown';
        let sources = [];

        // 1. Safety Filter
        const blockedTerm = BLOCKED_TOPICS.find(term => lowerMsg.includes(term));
        if (blockedTerm) {
            responseText = `I cannot provide advice on **${blockedTerm}** as it is outside my governance scope. Please consult a professional.`;
            intent = 'Blocked';
            await logInteraction(userId, message, responseText, intent, sources);
            return { text: responseText };
        }

        // 2. Status Check Intent
        if (lowerMsg.includes('status') || lowerMsg.includes('track')) {
            intent = 'StatusCheck';
            const match = lowerMsg.match(/\d+/); // Extract numbers
            if (match) { // Query by ID
                // Implement specific ID lookup logic similar to old aiService but robust
                // For MVP, we pass to specific handler
                return await handleStatusCheck(match[0], userId, message);
            } else if (userId) { // Query "my status"
                // Check latest grievance
                return await handleMyLatestStatus(userId, message);
            } else {
                responseText = "Please provide the Grievance ID you want to track (e.g., 'Status of 12345').";
            }
        }

        // 3. RAG / Knowledge Base Lookup (Simple Keyword Match for MVP)
        else {
            const tokenizer = new natural.WordTokenizer();
            const tokens = new Set(tokenizer.tokenize(lowerMsg));

            let bestMatch = null;
            let maxScore = 0;

            for (const item of knowledgeBase) {
                // Check keyword overlap
                const overlap = item.keywords.filter(k => lowerMsg.includes(k)).length;
                if (overlap > maxScore) {
                    maxScore = overlap;
                    bestMatch = item;
                }
            }

            if (maxScore > 0) {
                responseText = bestMatch.answer;
                intent = 'InfoRetrieval';
                sources.push({ id: bestMatch.id, type: 'KB' });
            } else {
                // Fallback / Greeting
                if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
                    responseText = "Namaste! I am Sahayak, your AI Assistant. You can ask me about grievance filing, status, or timelines.";
                    intent = 'Greeting';
                }
            }
        }

        // 4. Log Interaction
        await logInteraction(userId, message, responseText, intent, sources);

        return { text: responseText };
    },

    /**
     * Get chat history for a user
     */
    getHistory: async (userId) => {
        if (!userId) return [];

        return await ChatbotLog.findAll({
            where: { userId },
            order: [['createdAt', 'ASC']],
            limit: 50 // Last 50 messages
        });
    }
};

// Helper: Status Check
async function handleStatusCheck(id, userId, originalMsg) {
    const grievance = await Grievance.findOne({
        where: {
            [require('sequelize').Op.or]: [{ id: id }, { uniqueId: id }]
        }
    });

    let text = '';
    if (!grievance) {
        text = `I couldn't find any grievance with ID #${id}.`;
    } else {
        // Privacy Check: For MVP, maybe allow status check if ID is known? 
        // Real gov systems often allow tracking by ID. 
        text = `Grievance #${grievance.uniqueId} is currently **${grievance.status}**.\nCategory: ${grievance.category}\nEscalation Level: ${grievance.escalationLevel}`;
        if (grievance.predictedSLA) {
            text += `\nExpected Resolution: ${new Date(grievance.predictedSLA).toLocaleDateString()}`;
        }
    }
    await logInteraction(userId, originalMsg, text, 'StatusCheck', [{ grievanceId: id }]);
    return { text };
}

async function handleMyLatestStatus(userId, originalMsg) {
    const grievance = await Grievance.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']]
    });

    let text = '';
    if (grievance) {
        text = `Your latest grievance #${grievance.uniqueId} is **${grievance.status}**.\nDo you want details on this one?`;
    } else {
        text = "You haven't submitted any grievances yet.";
    }
    await logInteraction(userId, originalMsg, text, 'StatusCheck', []);
    return { text };
}

// Helper: Logger
async function logInteraction(userId, query, response, intent, sources) {
    try {
        await ChatbotLog.create({
            userId, // nullable
            sessionId: 'temp-session', // In real app, pass session ID from client
            query,
            response,
            intent,
            sources
        });
    } catch (e) {
        console.error('Chatbot Logging Failed:', e);
    }
}

module.exports = chatbotService;
