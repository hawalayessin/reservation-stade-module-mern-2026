const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  createAvailability,
  getAvailabilityByStadium,
  getAllAvailabilityByStadium,
  updateAvailability,
  deleteAvailability,
} = require('../controllers/availabilityController');

router.post('/', protect, createAvailability);
router.get('/stadium/:stadiumId', getAvailabilityByStadium);
router.put('/:id', protect, updateAvailability);
router.delete('/:id', protect, deleteAvailability);
router.get('/admin/stadium/:stadiumId', protect, getAllAvailabilityByStadium);
module.exports = router;
