const natural = require('natural');
const { Grievance, AICluster } = require('../../models');
const { Op } = require('sequelize');

const tfidf = new natural.TfIdf();

const clusteringService = {
    /**
     * Detect duplicates for a specific grievance
     * Returns { isDuplicate: boolean, originalId: number, confidence: number }
     */
    checkDuplicate: async (newGrievance) => {
        // 1. Get recent grievances (last 7 days) in same category
        const recent = await Grievance.findAll({
            where: {
                category: newGrievance.category,
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                },
                id: { [Op.ne]: newGrievance.id }
            }
        });

        if (recent.length === 0) return { isDuplicate: false };

        // 2. Simple Jaccard Index or TF-IDF comparison
        // For MVP, we use Jaccard on tokenized description
        const tokenizer = new natural.WordTokenizer();
        const newTokens = new Set(tokenizer.tokenize(newGrievance.description.toLowerCase()));

        let bestMatch = null;
        let maxScore = 0;

        for (const g of recent) {
            const otherTokens = new Set(tokenizer.tokenize(g.description.toLowerCase()));

            // Jaccard Similarity
            const intersection = new Set([...newTokens].filter(x => otherTokens.has(x)));
            const union = new Set([...newTokens, ...otherTokens]);
            const score = intersection.size / union.size;

            if (score > maxScore) {
                maxScore = score;
                bestMatch = g;
            }
        }

        // 3. Threshold check
        if (maxScore > 0.7) {
            return {
                isDuplicate: true,
                originalId: bestMatch.id,
                confidence: maxScore
            };
        }

        return { isDuplicate: false, confidence: maxScore };
    },

    /**
     * Cluster grievances into topics (Batch Job)
     */
    runClustering: async () => {
        console.log('[AI] Running Clustering Job...');
        const allPending = await Grievance.findAll({
            where: { status: 'Pending' },
            limit: 100
        });

        // Simple K-Means-like grouping by description similarity
        // ... (Simplified for MVP) ...
    }
};

module.exports = clusteringService;
