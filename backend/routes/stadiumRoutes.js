const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createStadium,
  getStadiums,
  getStadiumById,
  updateStadium,
  deleteStadium,
} = require('../controllers/stadiumController');

router.route('/')
  .post(protect, createStadium)
  .get(protect, getStadiums);

router.route('/:id')
  .get(protect, getStadiumById)
  .put(protect, updateStadium)
  .delete(protect, deleteStadium);

module.exports = router;
