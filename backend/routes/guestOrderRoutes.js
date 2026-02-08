const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

const router = express.Router();

// @route   POST /api/guest-orders
// @desc    Create new guest order
// @access  Public
router.post('/', [
  body('customerInfo.name').trim().notEmpty().withMessage('Full name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').isMobilePhone('en-IN').withMessage('Valid phone number required'),
  body('customerInfo.address').trim().notEmpty().withMessage('Address is required'),
  body('customerInfo.city').trim().notEmpty().withMessage('City is required'),
  body('customerInfo.state').optional().trim().notEmpty().withMessage('State cannot be empty if provided'),
  body('customerInfo.postalCode').trim().matches(/^\d{6}$/).withMessage('Valid 6-digit PIN code required'),
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('paymentMethod').isIn(['cod', 'card', 'upi', 'netbanking']).withMessage('Invalid payment method')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { customerInfo, items, paymentMethod } = req.body;

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      // Since we're storing product data in localStorage, we need to validate against database
      const product = await Product.findById(item._id || item.product);
      
      if (!product || product.status !== 'published') {
        return next(new ErrorResponse(`Product not found or unavailable: ${item.name}`, 404));
      }

      // Check if the stored price matches current price (basic validation)
      const currentPrice = product.discountPrice || product.price;
      if (Math.abs(currentPrice - item.price) > 1) {
        console.warn(`Price mismatch for ${product.name}: stored ${item.price}, current ${currentPrice}`);
      }

      const finalPrice = item.price; // Use stored price to avoid discrepancies
      const itemTotal = finalPrice * (item.quantity || 1);
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: finalPrice,
        quantity: item.quantity || 1,
        image: product.images && product.images.length > 0 ? product.images[0].url : ''
      });

      subtotal += itemTotal;

      // Update product stock
      if (product.stock >= (item.quantity || 1)) {
        product.stock -= (item.quantity || 1);
        product.popularity += (item.quantity || 1);
        await product.save();
      } else {
        // For development/testing: Allow order but log warning
        console.warn(`Order placed for ${product.name} despite low stock. Available: ${product.stock}, Requested: ${item.quantity || 1}`);
        // Optionally reduce stock to negative value to track overselling
        // product.stock -= (item.quantity || 1);
        // await product.save();
      }
    }

    // Calculate tax (18%)
    const tax = subtotal * 0.18;
    
    // Free shipping for orders over ₹2000
    const shippingCost = subtotal >= 2000 ? 0 : 150;
    
    const totalAmount = subtotal 
    // + tax + shippingCost
    ;

    // Generate order number
    const orderNumber = `WYNA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create guest order
    const order = new Order({
      orderNumber,
      shippingAddress: {
        fullName: customerInfo.name,
        phone: customerInfo.phone,
        street: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zipCode: customerInfo.postalCode,
        country: customerInfo.country
      },
      items: orderItems,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      orderStatus: 'pending'
    });

    const savedOrder = await order.save();

    // Populate product details for response
    await savedOrder.populate([
      { path: 'items.product', select: 'name slug images' }
    ]);

    // Send order confirmation email for guest orders
    try {
      const guestUser = {
        name: customerInfo.name,
        email: customerInfo.email
      };
      await sendOrderConfirmationEmail(savedOrder, guestUser);
    } catch (emailError) {
      console.error('Failed to send guest order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      data: savedOrder,
      message: 'Order placed successfully!'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/guest-orders/:orderNumber
// @desc    Get guest order by order number
// @access  Public
router.get('/:orderNumber', async (req, res, next) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber
    }).populate([
      { path: 'items.product', select: 'name slug images' }
    ]);

    if (!order) {
      return next(new ErrorResponse('Order not found', 404));
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;