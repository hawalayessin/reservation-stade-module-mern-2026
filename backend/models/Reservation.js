const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stadium',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    availability: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Availability',
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
