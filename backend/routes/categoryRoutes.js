const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const { ErrorResponse } = require('../middleware/error');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ active: true })
      .sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/categories/featured
// @desc    Get featured categories
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const categories = await Category.find({ 
      active: true, 
      featured: true 
    })
      .sort({ sortOrder: 1, name: 1 })
      .limit(6);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category || !category.active) {
      return next(new ErrorResponse('Category not found', 404));
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/categories/slug/:slug
// @desc    Get category by slug
// @access  Public
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug, 
      active: true 
    });

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('parentCategory').optional().isMongoId().withMessage('Parent category must be a valid ID')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Process image to match expected format
    let processedBody = { ...req.body };
    if (req.body.image && typeof req.body.image === 'string') {
      processedBody.image = req.body.image;
    }
    if (req.body.bannerImage && typeof req.body.bannerImage === 'string') {
      processedBody.bannerImage = req.body.bannerImage;
    }

    const category = new Category(processedBody);
    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      data: savedCategory
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ErrorResponse('Category with this name already exists', 400));
    }
    next(error);
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    // Check if parent category exists (if provided)
    if (req.body.parentCategory) {
      const parentCategory = await Category.findById(req.body.parentCategory);
      if (!parentCategory) {
        return next(new ErrorResponse('Parent category not found', 404));
      }
      if (parentCategory._id.toString() === req.params.id) {
        return next(new ErrorResponse('Category cannot be its own parent', 400));
      }
    }

    // Process image to match expected format
    let processedBody = { ...req.body };
    if (req.body.image && typeof req.body.image === 'string') {
      processedBody.image = req.body.image;
    }
    if (req.body.bannerImage && typeof req.body.bannerImage === 'string') {
      processedBody.bannerImage = req.body.bannerImage;
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      processedBody,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    // Check if category has products
    const Product = require('../models/Product');
    const productCount = await Product.countDocuments({ category: req.params.id });
    
    if (productCount > 0) {
      return next(new ErrorResponse('Cannot delete category with associated products. Deactivate instead.', 400));
    }

    await category.remove();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;