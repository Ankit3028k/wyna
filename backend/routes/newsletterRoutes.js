const express = require('express');
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const { ErrorResponse } = require('../middleware/error');

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
  body('name').optional().trim().isLength({ max: 50 }).withMessage('Name must be less than 50 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, name, preferences = {} } = req.body;

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email });
    
    if (subscriber) {
      if (subscriber.subscribed) {
        return next(new ErrorResponse('Already subscribed to newsletter', 400));
      }
      
      // Re-subscribe if previously unsubscribed
      subscriber.subscribed = true;
      subscriber.unsubscribedAt = null;
      subscriber.preferences = { ...subscriber.preferences, ...preferences };
    } else {
      // Create new subscriber
      subscriber = new Newsletter({
        email,
        name,
        preferences,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        source: req.body.source || 'website'
      });
    }

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ErrorResponse('Email already subscribed', 400));
    }
    next(error);
  }
});

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber || !subscriber.subscribed) {
      return next(new ErrorResponse('Not subscribed to newsletter', 400));
    }

    subscriber.subscribed = false;
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/newsletter/subscribers
// @desc    Get all subscribers (Admin only)
// @access  Private (Admin only)
router.get('/subscribers', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;

    const query = {};
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const subscribers = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Newsletter.countDocuments(query);

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubscribers: total
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/newsletter/stats
// @desc    Get newsletter statistics (Admin only)
// @access  Private (Admin only)
router.get('/stats', async (req, res, next) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments();
    const activeSubscribers = await Newsletter.countDocuments({ subscribed: true });
    const unsubscribedSubscribers = await Newsletter.countDocuments({ subscribed: false });
    
    // Get recent subscriptions (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSubscriptions = await Newsletter.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get subscription sources
    const sources = await Newsletter.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalSubscribers,
        activeSubscribers,
        unsubscribedSubscribers,
        recentSubscriptions,
        sources
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;