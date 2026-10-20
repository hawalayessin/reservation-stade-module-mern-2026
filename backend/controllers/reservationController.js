const Reservation = require('../models/Reservation');
const Availability = require('../models/Availability');


const createReservation = async (req, res) => {
  let claimedSlot;
  let reservation;
  try {
    const { stadium, availability } = req.body;
    if (!stadium || !availability) {
      return res.status(400).json({ message: 'Stadium and availability are required' });
    }
    // A single atomic write selects the winner when requests race for a slot.
    claimedSlot = await Availability.findOneAndUpdate(
      { _id: availability, stadium, isAvailable: true },
      { $set: { isAvailable: false } },
      { new: true }
    );
    if (!claimedSlot) {
      return res.status(409).json({ message: 'Slot unavailable for this stadium' });
    }
    reservation = await Reservation.create({
      user: req.userId, stadium: claimedSlot.stadium, availability: claimedSlot._id,
      startTime: claimedSlot.startTime, endTime: claimedSlot.endTime,
    });
    return res.status(201).json(reservation);
  } catch (error) {
    if (claimedSlot && !reservation) {
      try {
        await Availability.findByIdAndUpdate(claimedSlot._id, { $set: { isAvailable: true } });
      } catch (rollbackError) {
        console.error('Slot rollback failed:', rollbackError.message);
      }
    }
    return res.status(500).json({ message: 'Unable to create reservation' });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.userId,
    })
      .populate('stadium')
      .populate('availability');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('stadium')
      .populate('availability');

    if (!reservation) {
      return res.status(404).json({
        message: 'Reservation not found',
      });
    }

    if (String(reservation.user) !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: 'Reservation not found',
      });
    }

    if (String(reservation.user) !== req.userId) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    if (reservation.availability) {
      await Availability.findByIdAndUpdate(
        reservation.availability,
        { isAvailable: true }
      );
    }

    await reservation.deleteOne();

    res.json({ message: 'Reservation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  

};

module.exports = {
  createReservation,
  getReservations,
  getReservationById,
  deleteReservation,


};
