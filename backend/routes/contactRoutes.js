const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');
const { ErrorResponse } = require('../middleware/error');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Please include a valid Indian phone number'),
  body('subject').trim().isLength({ min: 5, max: 100 }).withMessage('Subject must be between 5 and 100 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('category').optional().isIn(['general', 'support', 'sales', 'wholesale', 'customization', 'feedback']).withMessage('Invalid category')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const contact = new Contact({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/contact
// @desc    Get all contact inquiries (Admin only)
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const category = req.query.category;
    const priority = req.query.priority;
    const search = req.query.search;

    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalContacts: total
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/contact/:id
// @desc    Get single contact inquiry (Admin only)
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorResponse('Contact inquiry not found', 404));
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact inquiry status (Admin only)
// @access  Private (Admin only)
router.put('/:id/status', protect, authorize('admin'), [
  body('status').isIn(['new', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new ErrorResponse('Contact inquiry not found', 404));
    }

    const updates = { status: req.body.status };
    
    if (req.body.status === 'in_progress') {
      updates.respondedAt = Date.now();
      updates.assignedTo = req.body.assignedTo;
    } else if (req.body.status === 'resolved' || req.body.status === 'closed') {
      updates.resolvedAt = Date.now();
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedContact
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/contact/stats
// @desc    Get contact statistics (Admin only)
// @access  Private (Admin only)
router.get('/stats/dashboard', protect, authorize('admin'), async (req, res, next) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'new' });
    const inProgressContacts = await Contact.countDocuments({ status: 'in_progress' });
    const resolvedContacts = await Contact.countDocuments({ status: 'resolved' });
    
    // Get contacts by category
    const byCategory = await Contact.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get contacts by status
    const byStatus = await Contact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent contacts (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalContacts,
        pendingContacts,
        inProgressContacts,
        resolvedContacts,
        byCategory,
        byStatus,
        recentContacts
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;