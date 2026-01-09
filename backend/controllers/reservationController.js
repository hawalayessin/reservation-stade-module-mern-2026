const Reservation = require('../models/Reservation');
const Availability = require('../models/Availability');


const createReservation = async (req, res) => {
  try {
    const { stadium, availability } = req.body;


    if (!availability) {
      return res.status(400).json({
        message: 'Availability is required',
      });
    }

 
    const slot = await Availability.findById(availability);

    if (!slot) {
      return res.status(404).json({
        message: 'Créneau introuvable',
      });
    }

    if (!slot.isAvailable) {
      return res.status(400).json({
        message: 'Créneau déjà réservé',
      });
    }

    const reservation = await Reservation.create({
      user: req.userId,
      stadium,
      availability,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    slot.isAvailable = false;
    await slot.save();

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ message: error.message });
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

    if (reservation.user.toString() !== req.userId) {
      return res.status(401).json({
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
