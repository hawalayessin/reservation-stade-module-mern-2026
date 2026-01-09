const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createReview,
  getReviewsByStadium,
  deleteReview,
} = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/stadium/:stadiumId', getReviewsByStadium);
router.delete('/:id', protect, deleteReview);

module.exports = router;
