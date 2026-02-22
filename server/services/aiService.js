const natural = require('natural');
const { Grievance } = require('../models');

// 1. NLP Classifier
let classifier;

// Seed data for training (Mocked for prototype, in real app this loads from DB)
const trainClassifier = () => {
    classifier = new natural.BayesClassifier();

    // Roads
    classifier.addDocument('pothole on the main road', 'Roads');
    classifier.addDocument('road is broken and dangerous', 'Roads');
    classifier.addDocument('traffic signal not working', 'Roads');

    // Water
    classifier.addDocument('water pipe leaking', 'Water Supply');
    classifier.addDocument('no water supply in my house', 'Water Supply');
    classifier.addDocument('dirty water coming from tap', 'Water Supply');

    // Electricity
    classifier.addDocument('street light not working', 'Electricity');
    classifier.addDocument('power cut for 5 hours', 'Electricity');
    classifier.addDocument('transformer sparks fire', 'Electricity');

    classifier.train();
};

// Initialize
trainClassifier();

// 2. Sentiment Analyzer
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
const tokenizer = new natural.WordTokenizer();

const aiService = {
    /**
     * Predicts Category from Description
     */
    classify: async (text) => {
        if (!text) return null;
        const classification = classifier.getClassifications(text);
        // classification is [{ label: 'Roads', value: 0.xxx }, ...]
        if (classification.length > 0) {
            return {
                suggestedCategory: classification[0].label,
                confidence: classification[0].value
            };
        }
        return null;
    },

    /**
     * Analyze Sentiment (-1 to 1)
     */
    analyzeSentiment: (text) => {
        if (!text) return 0;
        const tokens = tokenizer.tokenize(text);
        const score = analyzer.getSentiment(tokens);
        return score; // Returns a number
    },

    /**
     * Calculate Risk Level based on Dept Load
     * Logic: If Dept has > X active tickets, Risk = High
     */
    predictRisk: async (departmentId) => {
        if (!departmentId) return 'Low';

        const activeCount = await Grievance.count({
            where: {
                departmentId,
                status: 'In Progress'
            }
        });

        // Thresholds (Static for MVP)
        if (activeCount > 20) return 'High';
        if (activeCount > 10) return 'Medium';
        return 'Low';
    },

    /**
     * AI Chatbot Logic (Rule-based for MVP)
     */
    chat: async (message, context) => {
        const lowerMsg = message.toLowerCase();
        let response = { text: "I'm sorry, I didn't understand that. I can help with Status, SLAs, or Drafting." };

        // 1. Check Status Intent
        if (lowerMsg.includes('status') || lowerMsg.includes('track')) {
            // Extract ID (e.g., "status of 45")
            const match = lowerMsg.match(/\d+/);
            if (match) {
                const id = match[0];
                const grievance = await Grievance.findByPk(id);
                if (grievance) {
                    if (context.userId && grievance.userId !== context.userId && context.role === 'Citizen') {
                        response.text = `I cannot show details for Grievance #${id} as it belongs to another user.`;
                    } else {
                        response.text = `Grievance #${id} is currently **${grievance.status}**.\nCategory: ${grievance.category}\nAssigned To: ${grievance.assignedTo ? 'Officer' : 'Pending Assignment'}`;
                    }
                } else {
                    response.text = `I couldn't find any grievance with ID #${id}.`;
                }
            } else {
                response.text = "Please provide the Grievance ID. (e.g., 'Status of #12')";
            }
        }
        // 2. SLA Inquiry Intent
        else if (lowerMsg.includes('sla') || lowerMsg.includes('time')) {
            response.text = "Standard SLAs:\n- Emergency: 12-24 Hours\n- Utilities (Water/Power): 24 Hours\n- Roads/Sanitation: 48 Hours\n- General Admin: 72 Hours.";
        }
        // 3. Greeting
        else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
            response.text = `Namaste! I am Sahayak, your AI Governance Assistant. How can I help you today?`;
        }

        return response;
    }
};

module.exports = aiService;
