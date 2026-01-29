const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { ErrorResponse } = require('../middleware/error');

console.log('Product routes loaded');

const router = express.Router();

// Log all requests to product routes
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET /api/products - Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, limit = 20, page = 1 } = req.query;
    const query = {};

    // Filter by category
    if (category) {
      const categoryDoc = await require('../models/Category').findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description')
      .exec();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/products - Create new product (admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('stock').isNumeric().withMessage('Stock must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Process images to match expected format
    let processedBody = { ...req.body };
    if (req.body.images && Array.isArray(req.body.images)) {
      processedBody.images = req.body.images.map(img => {
        // If image is a string URL, convert to object format
        if (typeof img === 'string') {
          return {
            url: img,
            alt: "Product image",
            isPrimary: false
          };
        } else if (typeof img === 'object' && img.url) {
          return {
            url: img.url,
            alt: img.alt || "Product image",
            isPrimary: img.isPrimary || false
          };
        }
        return img;
      });
    }

    const product = new Product(processedBody);
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Product with this name already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().isLength({ min: 3 }).withMessage('Product name must be at least 3 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('category').optional().isMongoId().withMessage('Valid category ID is required'),
  body('stock').optional().isNumeric().withMessage('Stock must be a number')
], async (req, res) => {
  console.log('PUT route hit, params:', req.params);
  console.log('PUT route hit, body:', req.body);
  try {
    console.log('PUT request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    // Process images to match expected format
    let processedBody = { ...req.body };
    if (req.body.images && Array.isArray(req.body.images)) {
      processedBody.images = req.body.images.map(img => {
        // If image is a string URL, convert to object format
        if (typeof img === 'string') {
          return {
            url: img,
            alt: "Product image",
            isPrimary: false
          };
        } else if (typeof img === 'object' && img.url) {
          return {
            url: img.url,
            alt: img.alt || "Product image",
            isPrimary: img.isPrimary || false
          };
        }
        return img;
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      processedBody,
      { new: true, runValidators: true }
    );

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product updated successfully');
    res.json(product);
  } catch (error) {
    console.log('Error updating product:', error);
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid product ID' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid product ID' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

module.exports = router;
