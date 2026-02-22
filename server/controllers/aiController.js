const chatbotService = require('../services/ai/chatbotService');

exports.chat = async (req, res) => {
    try {
        const { message, context } = req.body;
        // Enrich context with authenticated user info if available
        const userContext = {
            ...context,
            userId: req.user ? req.user.id : null,
            // Note: req.user might be null if not using auth middleware, check client
        };
        // For MVP, if client sends role/userId in context (unsecure but robust for demo)
        const effectiveUserId = req.user?.id || context?.userId || null;

        const response = await chatbotService.processMessage(effectiveUserId, message, userContext);
        res.json(response);
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: 'Sahayak is currently unavailable.' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        if (!userId) return res.json([]);

        const history = await chatbotService.getHistory(userId);
        res.json(history.map(h => ({
            timestamp: h.createdAt,
            query: h.query,
            response: h.response
        })));
    } catch (error) {
        console.error('Chat History Error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
