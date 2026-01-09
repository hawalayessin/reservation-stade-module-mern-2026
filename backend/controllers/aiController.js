const Review = require('../models/Review');
const { getModel } = require('../config/gemini');


const analyzeReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            stadium: req.params.stadiumId,
        });

        if (reviews.length === 0) {
            return res.json({
                analysis: 'Aucun avis disponible pour ce stade.',
            });
        }

        const reviewsText = reviews
            .map((r) => `Note: ${r.rating}, Commentaire: ${r.comment}`)
            .join('\n');

        const prompt = `
Analyse les avis suivants sur un stade sportif et génère un résumé clair.
Avis :
${reviewsText}
`;

        const model = getModel();
        const result = await model.generateContent(prompt);

        res.json({
            analysis: result.response.text(),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { analyzeReviews };
