import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'], required: true },
  isAvailable: { type: Boolean, default: true }
});

const RestaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true,
  },
  cuisineType: {
    type: [String],
    required: [true, 'Please specify at least one cuisine type'],
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  menu: [MenuItemSchema],
  capacity: {
    totalTables: { type: Number, required: true },
    maxGuests: { type: Number, required: true },
  },
  operatingHours: {
    open: { type: String, required: true },  // Format "HH:MM" e.g., "11:00"
    close: { type: String, required: true }, // Format "HH:MM" e.g., "22:00"
  },
  averageRating: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export default mongoose.model('Restaurant', RestaurantSchema);