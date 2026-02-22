const natural = require('natural');
const { GrievanceCategory } = require('../../models');

let classifier;

const initialize = async () => {
    classifier = new natural.BayesClassifier();

    // 1. Load Training Data (Mock + DB)
    // Roads
    classifier.addDocument('pothole deep road broken', 'Roads');
    classifier.addDocument('traffic signal light not working', 'Roads');
    classifier.addDocument('street light broken dark', 'Roads');

    // Water
    classifier.addDocument('water pipe leaking supply', 'Water Supply');
    classifier.addDocument('dirty water muddy smell', 'Water Supply');
    classifier.addDocument('no water supply pressure', 'Water Supply');

    // Electricity
    classifier.addDocument('power cut electricity gone', 'Electricity');
    classifier.addDocument('transformer spark fire danger', 'Electricity');
    classifier.addDocument('meter reading bill wrong', 'Electricity');

    // Garbage
    classifier.addDocument('garbage dump smell trash', 'Sanitation');
    classifier.addDocument('drain blocked overflow', 'Sanitation');
    classifier.addDocument('cleaning not done street', 'Sanitation');

    classifier.train();
    console.log('[AI] Classification Model Trained');
};

// Auto-initialize
initialize();

const classificationService = {
    predict: async (text) => {
        if (!text) return null;
        if (!classifier) await initialize();

        const classifications = classifier.getClassifications(text);
        if (classifications.length === 0) return null;

        const topPrediction = classifications[0];

        // Explainability: Find keywords that triggered this
        // Naive impl: check intersection of query words with known category keywords
        // For MVP, we pass generic explanation
        const explanation = `Matched likely category '${topPrediction.label}' with confidence ${(topPrediction.value * 100).toFixed(1)}%`;

        return {
            category: topPrediction.label,
            confidence: topPrediction.value, // value is probability
            explanation: explanation
        };
    }
};

module.exports = classificationService;
