const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { ErrorResponse } = require('../middleware/error');

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res, next) => { 
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: { path: 'category', select: 'name slug' }
    }); 

    // Add calculated fields to wishlist products
    const wishlistWithCalculatedFields = user.wishlist.map(product => ({ 
      ...product.toObject(),
      finalPrice: product.discountPrice || product.price,
      hasDiscount: !!product.discountPrice,
      discountPercentage: product.discountPrice 
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0
    }));

    res.json({
      success: true,
      data: wishlistWithCalculatedFields
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/:productId', protect, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    
    if (!product || product.status !== 'published') {
      return next(new ErrorResponse('Product not found', 404));
    }

    const user = await User.findById(req.user.id);

    // Check if product already in wishlist
    if (user.wishlist.includes(req.params.productId)) {
      return next(new ErrorResponse('Product already in wishlist', 400));
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // Check if product in wishlist
    if (!user.wishlist.includes(req.params.productId)) {
      return next(new ErrorResponse('Product not in wishlist', 400));
    }

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.productId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/wishlist
// @desc    Clear wishlist
// @access  Private
router.delete('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;