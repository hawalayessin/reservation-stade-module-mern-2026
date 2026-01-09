const Review = require('../models/Review');


const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      user: req.userId,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByStadium = async (req, res) => {
  try {
    const reviews = await Review.find({
      stadium: req.params.stadiumId,
    }).populate('user', 'username');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getReviewsByStadium,
  deleteReview,
};
