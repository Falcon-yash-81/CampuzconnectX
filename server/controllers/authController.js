const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026_dev',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      year: user.year,
      bio: user.bio,
      skills: user.skills,
      learningSkills: user.learningSkills,
      availability: user.availability,
      rating: user.rating,
      reputationScore: user.reputationScore,
      requestsHelped: user.requestsHelped,
      requestsCompleted: user.requestsCompleted,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, department, year, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create user (role default is STUDENT, allowed ADMIN if specified in registration or testing)
    const user = await User.create({
      name,
      email,
      password,
      department: department || 'Computer Science',
      year: year || '3rd Year',
      role: role && ['STUDENT', 'ADMIN'].includes(role) ? role : 'STUDENT',
      skills: req.body.skills || [],
      learningSkills: req.body.learningSkills || [],
      availability: req.body.availability || 'Flexible',
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user & include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Quick Demo Login
// @route   POST /api/auth/demo-login
// @access  Public
exports.demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body; // 'studentA' (helper), 'studentB' (requester), or 'admin'
    let targetEmail = 'admin@campusconnect.edu';

    if (role === 'studentA' || role === 'helper') {
      targetEmail = 'yashas@campusconnect.edu';
    } else if (role === 'studentB' || role === 'requester') {
      targetEmail = 'alex@campusconnect.edu';
    }

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      // Fallback to first user matching role
      if (role === 'admin') {
        user = await User.findOne({ role: 'ADMIN' });
      } else {
        user = await User.findOne({ role: 'STUDENT' });
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Demo user not found. Please run seed script or register.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
