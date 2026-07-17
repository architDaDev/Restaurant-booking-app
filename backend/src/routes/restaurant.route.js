import express from 'express';
import { 
  createRestaurant, 
  getAllRestaurants, 
  getRestaurantById, 
  addMenuItem 
} from '../controllers/restaurant.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Routes (Diners browsing the site)
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Protected/Authorized Routes (Only available to registered restaurant owners)
router.post('/', protect, authorize('restaurant_owner'), createRestaurant);
router.post('/:id/menu', protect, authorize('restaurant_owner'), addMenuItem);

export default router;