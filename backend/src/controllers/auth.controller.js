import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// Helper function to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper function to bundle token inside an HttpOnly cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict',
  };

  // Remove password from payload response
  user.password = undefined;

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    status: 'success',
    user,
  });
};

/**
 * @description    Register User
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'fail', message: 'User already exists' });
    }

    // Create user
    const user = await User.create({ name, email, password, role, phoneNumber });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
 /**
 * @desc    Login User
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password presence
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide an email and password' });
    }

    // Check for user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
/**
 * @description logout user, clear cookie
 * @route GET /api/v1/auth/logout
 * @access private
 */
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success', message: 'User logged out successfully' });
};