const Stadium = require('../models/Stadium');


const createStadium = async (req, res) => {
  try {
    const stadium = await Stadium.create({
      ...req.body,
      user: req.userId,
    });

    res.status(201).json(stadium);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.find();

    res.json(stadiums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getStadiumById = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);

    if (!stadium) {
      return res.status(404).json({ message: 'Stadium not found' });
    }

    res.json(stadium);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);

    if (!stadium) {
      return res.status(404).json({ message: 'Stadium not found' });
    }

    if (stadium.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedStadium = await Stadium.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedStadium);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);

    if (!stadium) {
      return res.status(404).json({ message: 'Stadium not found' });
    }

    if (stadium.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await stadium.deleteOne();
    res.json({ message: 'Stadium removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStadium,
  getStadiums,
  getStadiumById,
  updateStadium,
  deleteStadium,
};
