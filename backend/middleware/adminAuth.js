const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect admin routes - Admin Authentication middleware
const adminAuth = async (req, res, next) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    // Get admin from token - check for adminId field
    req.admin = await Admin.findById(decoded.adminId || decoded.id);
    console.log('Admin found:', req.admin);
    
    if (!req.admin) {
      console.log('Admin not found in database');
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (!req.admin.isActive) {
      console.log('Admin account deactivated');
      return res.status(401).json({
        success: false,
        message: 'Admin account deactivated'
      });
    }

    console.log('Admin authentication successful');
    next();
  } catch (error) {
    console.log('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

module.exports = adminAuth;