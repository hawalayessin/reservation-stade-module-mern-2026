const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { analyzeReviews } = require('../controllers/aiController');

router.post('/analyze-reviews/:stadiumId', protect, analyzeReviews);

module.exports = router;
