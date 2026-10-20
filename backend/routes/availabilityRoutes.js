const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');

const {
  createAvailability,
  getAvailabilityByStadium,
  getAllAvailabilityByStadium,
  updateAvailability,
  deleteAvailability,
} = require('../controllers/availabilityController');

router.post('/', protect, adminOnly, createAvailability);
router.get('/stadium/:stadiumId', getAvailabilityByStadium);
router.put('/:id', protect, adminOnly, updateAvailability);
router.delete('/:id', protect, adminOnly, deleteAvailability);
router.get('/admin/stadium/:stadiumId', protect, adminOnly, getAllAvailabilityByStadium);
module.exports = router;
