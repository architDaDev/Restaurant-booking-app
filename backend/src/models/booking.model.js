import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please pick a date for the reservation'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Please select a time slot'], // e.g., "19:00"
  },
  guestCount: {
    type: Number,
    required: [true, 'Please specify the number of guests'],
    min: [1, 'Booking must be for at least 1 person'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  specialRequests: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);