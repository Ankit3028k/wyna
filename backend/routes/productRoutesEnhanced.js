const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const adminAuth = require('../middleware/adminAuth');
const { ErrorResponse } = require('../middleware/error');

const router = express.Router();

// Helper function to convert image URLs to full URLs in production
const convertImageUrls = (product) => {
  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.CLIENT_URL || 'https://www.wyna.in';
    
    // Convert images array
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map(img => {
        if (img.url) {
          // Only convert if it's a relative path starting with /
          if (img.url.startsWith('/')) {
            return {
              ...img,
              url: `${baseUrl}${img.url}`
            };
          }
          // If it's already a full URL, check if it's malformed and fix it
          else if (img.url.includes('wyna.inhttps//') || img.url.includes('wyna.inhttp//')) {
            // Fix malformed URLs by extracting the correct part
            const correctedUrl = img.url.replace(/wyna\.inhttps?\/\//, 'wyna.in/');
            return {
              ...img,
              url: correctedUrl.startsWith('http') ? correctedUrl : `https://${correctedUrl}`
            };
          }
        }
        return img;
      });
    }
    
    // Convert single image field
    if (product.image) {
      if (product.image.startsWith('/')) {
        product.image = `${baseUrl}${product.image}`;
      }
      // Fix malformed single image URL
      else if (product.image.includes('wyna.inhttps//') || product.image.includes('wyna.inhttp//')) {
        const correctedUrl = product.image.replace(/wyna\.inhttps?\/\//, 'wyna.in/');
        product.image = correctedUrl.startsWith('http') ? correctedUrl : `https://${correctedUrl}`;
      }
    }
  }
  return product;
};

// @route   GET /api/products
// @desc    Get all products with filters, search, pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'popularity']).withMessage('Invalid sort option')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { 
      category, 
      subCategory,
      search, 
      sort, 
      limit = 20, 
      page = 1,
      minPrice,
      maxPrice,
      featured,
      newArrival,
      inStock,
      material,
      weaveType,
      color,
      tags
    } = req.query;

    // Build query object
    const query = { status: 'published' };

    // Category filter
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Sub-category filter
    if (subCategory) {
      query.subCategory = { $regex: subCategory, $options: 'i' };
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Boolean filters
    if (featured) query.featured = featured === 'true';
    if (newArrival) query.newArrival = newArrival === 'true';
    if (inStock) query.inStock = inStock === 'true';

    // Material, weave type, color filters
    if (material) query.material = { $regex: material, $options: 'i' };
    if (weaveType) query.weaveType = { $regex: weaveType, $options: 'i' };
    if (color) query.color = { $regex: color, $options: 'i' };

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
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
      case 'popularity':
        sortOption = { popularity: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);

    // Add calculated fields and convert image URLs
    const productsWithCalculatedFields = products.map(product => {
      const convertedProduct = convertImageUrls(product);
      return {
        ...convertedProduct,
        finalPrice: product.discountPrice || product.price,
        hasDiscount: !!product.discountPrice,
        discountPercentage: product.discountPrice 
          ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
          : 0
      };
    });

    res.json({
      success: true,
      data: productsWithCalculatedFields,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description slug')
      .lean();

    if (!product || product.status !== 'published') {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Increment popularity
    await Product.findByIdAndUpdate(req.params.id, { $inc: { popularity: 1 } });

    // Add calculated fields
    const productWithCalculatedFields = {
      ...product,
      finalPrice: product.discountPrice || product.price,
      hasDiscount: !!product.discountPrice,
      discountPercentage: product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0
    };

    res.json({
      success: true,
      data: productWithCalculatedFields
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/slug/:slug
// @desc    Get product by slug
// @access  Public
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: 'published' })
      .populate('category', 'name description slug')
      .lean();

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Increment popularity
    await Product.findByIdAndUpdate(product._id, { $inc: { popularity: 1 } });

    // Add calculated fields
    const productWithCalculatedFields = {
      ...product,
      finalPrice: product.discountPrice || product.price,
      hasDiscount: !!product.discountPrice,
      discountPercentage: product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0
    };

    res.json({
      success: true,
      data: productWithCalculatedFields
    });
  } catch (error) {
    next(error);
  }
}); // <--- Added missing closing brace

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Admin only)
router.post('/', adminAuth, [
  body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*.url').custom((value) => {
    if (!value) return true; // Allow optional URL field - array validation ensures at least one image
    // Accept both full URLs and relative paths starting with /
    const isFullUrl = value.startsWith('http://') || value.startsWith('https://');
    const isRelativePath = value.startsWith('/');
    return isFullUrl || isRelativePath;
  }).withMessage('Each image must have a valid URL or relative path')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    // Prepare product data with proper image formatting
    const productData = { ...req.body };
    
    // Ensure images are properly formatted
    if (req.body.images) {
      // Validate that images is an array
      if (Array.isArray(req.body.images)) {
        // Process each image to ensure proper format
        productData.images = req.body.images.map(img => {
          if (typeof img === 'string') {
            // If image is just a string URL, convert to object format
            return {
              url: img,
              alt: "Product image",
              isPrimary: false
            };
          } else {
            // If image is already an object, return as is
            return img;
          }
        });
      }
    }

    const product = new Product(productData);
    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Product name must be between 3 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('price').optional().isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('category').optional().isMongoId().withMessage('Valid category ID is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*.url').optional().custom((value) => {
    if (!value) return true; // Optional - skip if not provided
    const isFullUrl = value.startsWith('http://') || value.startsWith('https://');
    const isRelativePath = value.startsWith('/');
    return isFullUrl || isRelativePath;
  }).withMessage('Each image must have a valid URL or relative path')
], async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Check if category exists (if provided)
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return next(new ErrorResponse('Category not found', 404));
      }
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // Ensure images are properly formatted
    if (req.body.images) {
      // Validate that images is an array
      if (Array.isArray(req.body.images)) {
        // Process each image to ensure proper format
        updateData.images = req.body.images.map(img => {
          if (typeof img === 'string') {
            // If image is just a string URL, convert to object format
            return {
              url: img,
              alt: "Product image",
              isPrimary: false
            };
          } else {
            // If image is already an object, return as is
            return img;
          }
        });
      }
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete('/:id', adminAuth, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    await product.remove();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/featured/home
// @desc    Get featured products for home page
// @access  Public
router.get('/featured/home', async (req, res, next) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      status: 'published',
      inStock: true 
    })
      .populate('category', 'name slug')
      .sort({ popularity: -1 })
      .limit(8)
      .lean();

    const productsWithCalculatedFields = products.map(product => ({
      ...product,
      finalPrice: product.discountPrice || product.price,
      hasDiscount: !!product.discountPrice,
      discountPercentage: product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0
    }));

    res.json({
      success: true,
      data: productsWithCalculatedFields
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/new-arrivals
// @desc    Get new arrival products
// @access  Public
router.get('/new-arrivals', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    
    const products = await Product.find({ 
      newArrival: true, 
      status: 'published',
      inStock: true 
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const productsWithCalculatedFields = products.map(product => ({
      ...product,
      finalPrice: product.discountPrice || product.price,
      hasDiscount: !!product.discountPrice,
      discountPercentage: product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0
    }));

    res.json({
      success: true,
      data: productsWithCalculatedFields
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/search-suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      status: 'published'
    })
      .select('name slug')
      .limit(10);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;