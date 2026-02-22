const natural = require('natural');
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
const tokenizer = new natural.WordTokenizer();

// Keywords that boost severity
const CRITICAL_KEYWORDS = ['death', 'fire', 'danger', 'accident', 'spark', 'explosion', 'collapsed'];
const URGENT_KEYWORDS = ['blocked', 'overflow', 'no water', 'dark', 'unsafe', 'broken'];

const severityService = {
    calculateSeverity: (text, category) => {
        let score = 0;
        const lowerText = text.toLowerCase();
        const tokens = tokenizer.tokenize(text);

        // 1. Keyword Analysis
        CRITICAL_KEYWORDS.forEach(word => {
            if (lowerText.includes(word)) score += 30;
        });

        URGENT_KEYWORDS.forEach(word => {
            if (lowerText.includes(word)) score += 15;
        });

        // 2. Sentiment Analysis (-5 to +5 range roughly)
        const sentiment = analyzer.getSentiment(tokens);
        // Negative sentiment increases severity
        if (sentiment < -2) score += 20;
        else if (sentiment < -1) score += 10;

        // 3. Category Bias
        if (category === 'Electricity' || category === 'Health') score += 10;

        // Cap at 100
        return Math.min(Math.max(score, 0), 100);
    },

    analyzeSentiment: (text) => {
        const tokens = tokenizer.tokenize(text);
        return analyzer.getSentiment(tokens);
    }
};

module.exports = severityService;
