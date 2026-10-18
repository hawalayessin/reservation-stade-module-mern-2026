const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createStadium,
  getStadiums,
  getStadiumById,
  updateStadium,
  deleteStadium,
} = require('../controllers/stadiumController');

router.route('/')
  .post(protect, adminOnly, createStadium)
  .get(protect, getStadiums);

router.route('/:id')
  .get(protect, getStadiumById)
  .put(protect, adminOnly, updateStadium)
  .delete(protect, adminOnly, deleteStadium);

module.exports = router;
