// In a real production system, this would define a TensorFlow.js model 
// or call a dedicated Python Microservice.
// For this MVP, we simulate image analysis to demonstrate the pipeline flow.

const imageService = {
    analyze: async (imageUrl) => {
        // Mock delay
        await new Promise(r => setTimeout(r, 500));

        // Deterministic mock based on filename or random
        let labels = [];
        let confidence = 0.8;

        if (imageUrl.includes('pothole')) labels = ['Pothole', 'Road Damage'];
        else if (imageUrl.includes('garbage')) labels = ['Garbage', 'Waste'];
        else if (imageUrl.includes('water')) labels = ['Water Leak', 'Pipe'];
        else labels = ['Infrastructure', 'Public Area'];

        return {
            labels: labels,
            detectedObjects: labels.map(l => ({ name: l, confidence: confidence })),
            isUnsafe: labels.includes('Road Damage') || labels.includes('Water Leak')
        };
    }
};

module.exports = imageService;
