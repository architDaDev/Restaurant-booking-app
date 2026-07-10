import express from 'express';
import { createReview, getRestaurantReviews } from '../controllers/review.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public route to view restaurant feedback
router.get('/restaurant/:restaurantId', getRestaurantReviews);

// Protected route to leave a review (Diners only)
router.post('/', protect, authorize('customer'), createReview);

export default router;