const Availability = require('../models/Availability');


const createAvailability = async (req, res) => {
  try {
    const availability = await Availability.create({
      stadium: req.body.stadium,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      isAvailable: true,
    });

    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAvailabilityByStadium = async (req, res) => {
  try {
    const availabilities = await Availability.find({
      stadium: req.params.stadiumId,
      isAvailable: true,
    });

    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllAvailabilityByStadium = async (req, res) => {
  try {
    const availabilities = await Availability.find({
      stadium: req.params.stadiumId,
    });
    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateAvailability = async (req, res) => {
  try {
    const availability = await Availability.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteAvailability = async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.json({ message: "Availability removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAvailability,
  getAvailabilityByStadium,
  updateAvailability,
  deleteAvailability,
  getAllAvailabilityByStadium,
};
