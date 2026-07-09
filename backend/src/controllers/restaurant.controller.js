import Restaurant from '../models/restaurants.model.js';
/** 
* @desc    Create/Register a new restaurant profile
* @route   POST /api/v1/restaurants
* @access  Private (Restaurant Owner only)
 */

export const createRestaurant = async (req, res) => {
  try {
    // Check if the owner already registered a restaurant (assuming 1 restaurant per owner account for now)
    const existingRestaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (existingRestaurant) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'You have already registered a restaurant profile under this account.' 
      });
    }

    // Spread the body data and inject the authenticated user's ID as the ownerId
    const restaurant = await Restaurant.create({
      ...req.body,
      ownerId: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: restaurant
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
/** 
* @desc    Get all restaurants (with optional city/cuisine filtering for customers)
* @route   GET /api/v1/restaurants
* @access  Public
*/
export const getAllRestaurants = async (req, res) => {
  try {
    const { city, cuisine } = req.query;
    let queryObj = {};

    // Basic filtering conditions
    if (city) queryObj['address.city'] = { $regex: city, $options: 'i' }; // Case-insensitive
    if (cuisine) queryObj.cuisineType = { $in: [new RegExp(cuisine, 'i')] };

    const restaurants = await Restaurant.find(queryObj);

    res.status(200).json({
      status: 'success',
      results: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
/** 
* @desc    Get a single restaurant by ID (includes menu and reviews)
* @route   GET /api/v1/restaurants/:id
* @access  Public
*/
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ status: 'fail', message: 'Restaurant not found' });
    }

    res.status(200).json({
      status: 'success',
      data: restaurant
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
/** 
* @desc    Add a menu item to the restaurant
* @route   POST /api/v1/restaurants/menu
* @access  Private (Restaurant Owner only)
*/
export const addMenuItem = async (req, res) => {
  try {
    // Find the restaurant owned by the current logged-in owner
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ status: 'fail', message: 'No restaurant associated with this owner account.' });
    }

    // Push the new menu item into the embedded menu schema array
    restaurant.menu.push(req.body);
    await restaurant.save();

    res.status(200).json({
      status: 'success',
      message: 'Menu item added successfully',
      data: restaurant.menu
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};