import Booking from '../models/booking.model.js';
import Restaurant from '../models/restaurants.model.js';
/** 
* @desc    Create a new table reservation
* @route   POST /api/v1/bookings
* @access  Private (Customers/Authenticated Users)
*/
export const createBooking = async (req, res) => {
  try {
    const { restaurantId, bookingDate, timeSlot, guestCount } = req.body;

    // 1. Find the target restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ status: 'fail', message: 'Restaurant not found.' });
    }

    // 2. Parse the target date to look it up accurately in MongoDB
    const parsedDate = new Date(bookingDate);

    // 3. Aggregate total guests already booked for this specific slot
    const existingBookings = await Booking.find({
      restaurantId,
      bookingDate: parsedDate,
      timeSlot,
      status: 'confirmed'
    });

    const currentBookedGuests = existingBookings.reduce((sum, booking) => sum + booking.guestCount, 0);

    // 4. Run safety availability checks
    if (currentBookedGuests + Number(guestCount) > restaurant.capacity.maxGuests) {
      return res.status(400).json({
        status: 'fail',
        message: `Reservation rejected. Fully booked for this slot. Available seats: ${restaurant.capacity.maxGuests - currentBookedGuests}`
      });
    }

    // 5. If capacity allows, create the reservation record
    const booking = await Booking.create({
      restaurantId,
      bookingDate: parsedDate,
      timeSlot,
      guestCount,
      customerId: req.user.id // Captured from authentication middleware
    });

    res.status(201).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

/**
* @desc    Get bookings for the logged-in restaurant owner's dashboard
* @route   GET /api/v1/bookings/dashboard
* @access  Private (Restaurant Owner Only)
*/
export const getPartnerDashboardBookings = async (req, res) => {
  try {
    // Find the restaurant owned by this user
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ status: 'fail', message: 'No restaurant found for this partner account.' });
    }

    // Fetch all bookings for this restaurant and populate customer details cleanly
    const bookings = await Booking.find({ restaurantId: restaurant._id })
      .populate('customerId', 'name email phoneNumber')
      .sort('bookingDate timeSlot'); // Order sequentially

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
/** 
* @desc    Get bookings for the logged-in customer's personal history
* @route   GET /api/v1/bookings/my-reservations
* @access  Private (Customer Only)
*/
export const getCustomerBookings = async (req, res) => {
  try {
    // Find all bookings matching this customer's ID and populate the restaurant info
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('restaurantId', 'name address cuisineType')
      .sort('-bookingDate'); // Show newest reservations first

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};