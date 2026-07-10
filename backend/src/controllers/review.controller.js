import Review from '../models/review.model.js'
import Booking from '../models/booking.model.js'
import Restaurant from '../models/restaurants.model.js'
/** 
* @desc    Create a new review for a restaurant
* @route   POST /api/v1/reviews
* @access  Private (Customers only)
*/
export const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;
    const customerId = req.user.id;

    // 1. Verify the restaurant actually exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ status: 'fail', message: 'Restaurant not found' });
    }

    // 2. Gatekeeping: Verify this customer has actually booked here before
    const hasBooked = await Booking.findOne({
      restaurantId,
      customerId,
      status: { $in: ['confirmed', 'completed'] }
    });

    if (!hasBooked) {
      return res.status(403).json({
        status: 'fail',
        message: 'Access Denied: You can only review restaurants where you have a valid reservation history.'
      });
    }

    // 3. Prevent duplicate reviews from the same user for the same restaurant
    const alreadyReviewed = await Review.findOne({ restaurantId, customerId });
    if (alreadyReviewed) {
      return res.status(400).json({ status: 'fail', message: 'You have already reviewed this restaurant.' });
    }

    // 4. Create the review
    const review = await Review.create({
      restaurantId,
      customerId,
      rating,
      comment
    });

    res.status(201).json({
      status: 'success',
      data: review
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
/** 
* @desc    Get all reviews for a specific restaurant
* @route   GET /api/v1/reviews/restaurant/:restaurantId
* @access  Public
*/
export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId })
      .populate('customerId', 'name') // Only fetch the customer's name for privacy
      .sort('-createdAt'); // Latest reviews first

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};