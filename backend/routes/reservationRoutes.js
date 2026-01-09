const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  createReservation,
  getReservations,
  getReservationById,
  deleteReservation,

} = require('../controllers/reservationController');

router.route('/')
  .post(protect, createReservation)
  .get(protect, getReservations);

router.route('/:id')
  .get(protect, getReservationById)
  .delete(protect, deleteReservation);

 


module.exports = router;
