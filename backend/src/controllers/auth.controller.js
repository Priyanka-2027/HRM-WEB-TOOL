import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { sendResponse, sendError } from '../utils/response.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpire,
  });
};

// Register User
export const register = async (req, res, next) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !password) {
      return sendError(res, 400, 'Please provide all required fields');
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return sendError(res, 400, 'User already exists with this email');
    }

    // Create user
    user = await User.create({
      email,
      firstName,
      lastName,
      password,
      role: 'employee',
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    return sendResponse(res, 201, {
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: userObj,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    return sendResponse(res, 200, {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userObj,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendResponse(res, 200, {
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout (optional - mainly for frontend)
export const logout = async (req, res, next) => {
  return sendResponse(res, 200, {
    success: true,
    message: 'Logged out successfully',
  });
};
