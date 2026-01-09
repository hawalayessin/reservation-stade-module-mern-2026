const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stadium',
      required: true,
    },
    date: {
      type: String,
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
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);
