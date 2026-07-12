import express from 'express';
import { createBooking, getPartnerDashboardBookings, getCustomerBookings } from '../controllers/booking.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All booking routes require an authenticated user session
router.use(protect);

// Customers make reservations
router.post('/', authorize('customer'), createBooking);

// Customers view their own personal history
router.get('/my-reservations', authorize('customer'), getCustomerBookings);

// Restaurant owners access their incoming guest lists
router.get('/dashboard', authorize('restaurant_owner'), getPartnerDashboardBookings);

export default router;