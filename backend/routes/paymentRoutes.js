const crypto = require('crypto');
const express = require('express');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');

const Order = require('../models/Order');
const Product = require('../models/Product');
const { ErrorResponse } = require('../middleware/error');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

const router = express.Router();

const normalizeRazorpayError = (err, fallbackMessage) => {
  const statusCode =
    err?.statusCode ||
    err?.response?.status ||
    (typeof err?.code === 'number' ? err.code : undefined) ||
    500;

  const message =
    err?.error?.description ||
    err?.error?.reason ||
    err?.error?.message ||
    err?.message ||
    fallbackMessage ||
    'Payment error';

  return new ErrorResponse(message, statusCode);
};

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ErrorResponse('Razorpay credentials are not configured', 500);
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const adjustInventoryOnce = async (order) => {
  if (order.inventoryAdjustedAt) return;

  for (const item of order.items) {
    const product = await Product.findById(item.product);

    if (!product || product.status !== 'published') {
      throw new Error(`Product not found or unavailable: ${item.product}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    product.stock -= item.quantity;
    product.popularity += item.quantity;
    await product.save();
  }

  order.inventoryAdjustedAt = new Date();
};

router.post(
  '/razorpay/create-order',
  [
    body('customerInfo.name').trim().notEmpty().withMessage('Full name is required'),
    body('customerInfo.email').isEmail().withMessage('Valid email is required'),
    body('customerInfo.phone').isMobilePhone('en-IN').withMessage('Valid phone number required'),
    body('customerInfo.address').trim().notEmpty().withMessage('Address is required'),
    body('customerInfo.city').trim().notEmpty().withMessage('City is required'),
    body('customerInfo.state').optional().trim().notEmpty().withMessage('State cannot be empty if provided'),
    body('customerInfo.postalCode').trim().matches(/^\d{6}$/).withMessage('Valid 6-digit PIN code required'),
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { customerInfo, items } = req.body;

      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item._id || item.product);

        if (!product || product.status !== 'published') {
          return next(new ErrorResponse(`Product not found or unavailable: ${item.name || item.product}`, 404));
        }

        const finalPrice = product.discountPrice || product.price;
        const quantity = item.quantity || 1;

        if (product.stock < quantity) {
          return next(new ErrorResponse(`Insufficient stock for ${product.name}`, 400));
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          price: finalPrice,
          quantity,
          image: product.images && product.images.length > 0 ? product.images[0].url : '',
        });

        subtotal += finalPrice * quantity;
      }

      const tax = subtotal * 0.18;
      const shippingCost = subtotal >= 2000 ? 0 : 150;
      const totalAmount = subtotal;

      const order = new Order({
        orderNumber: `WYNA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customerEmail: customerInfo.email,
        shippingAddress: {
          fullName: customerInfo.name,
          phone: customerInfo.phone,
          street: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zipCode: customerInfo.postalCode,
          country: customerInfo.country,
        },
        items: orderItems,
        paymentMethod: 'online',
        paymentProvider: 'razorpay',
        paymentStatus: 'pending',
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        orderStatus: 'pending',
      });

      const savedOrder = await order.save();

      const razorpay = getRazorpayClient();

      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(savedOrder.totalAmount * 100),
        currency: 'INR',
        receipt: savedOrder.orderNumber,
        notes: {
          orderId: savedOrder._id.toString(),
          orderNumber: savedOrder.orderNumber,
        },
      });

      savedOrder.razorpayOrderId = razorpayOrder.id;
      await savedOrder.save();

      res.status(201).json({
        success: true,
        data: {
          orderId: savedOrder._id,
          orderNumber: savedOrder.orderNumber,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          razorpayOrderId: razorpayOrder.id,
          keyId: process.env.RAZORPAY_KEY_ID,
          customer: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone,
          },
        },
      });
    } catch (error) {
      next(normalizeRazorpayError(error, 'Failed to create Razorpay order'));
    }
  },
);

router.post(
  '/razorpay/verify',
  [
    body('orderId').isMongoId().withMessage('Valid orderId is required'),
    body('razorpay_order_id').notEmpty().withMessage('razorpay_order_id is required'),
    body('razorpay_payment_id').notEmpty().withMessage('razorpay_payment_id is required'),
    body('razorpay_signature').notEmpty().withMessage('razorpay_signature is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return next(new ErrorResponse('Order not found', 404));
      }

      if (order.paymentStatus === 'completed') {
        return res.json({ success: true, data: order });
      }

      if (!process.env.RAZORPAY_KEY_SECRET) {
        return next(new ErrorResponse('Razorpay secret not configured', 500));
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        order.paymentStatus = 'failed';
        await order.save();
        return next(new ErrorResponse('Payment verification failed', 400));
      }

      order.razorpayOrderId = razorpay_order_id;
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;
      order.paymentProvider = 'razorpay';
      order.paymentStatus = 'completed';
      order.paidAt = new Date();
      order.orderStatus = 'confirmed';

      await adjustInventoryOnce(order);
      await order.save();

      try {
        const guestUser = {
          name: order.shippingAddress.fullName,
          email: order.customerEmail,
        };
        if (guestUser.email) {
          await sendOrderConfirmationEmail(order, guestUser);
        }
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(normalizeRazorpayError(error, 'Payment verification failed'));
    }
  },
);

router.post('/razorpay/webhook', async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
      return res.status(400).json({ success: false, message: 'Missing signature' });
    }

    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      return res.status(500).json({ success: false, message: 'Webhook secret not configured' });
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      return res.status(400).json({ success: false, message: 'Missing raw body' });
    }
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expected !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody.toString('utf8'));

    const razorpayOrderId = payload?.payload?.order?.entity?.id;
    const razorpayPaymentId = payload?.payload?.payment?.entity?.id;

    if (!razorpayOrderId) {
      return res.json({ success: true });
    }

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return res.json({ success: true });
    }

    if (order.paymentStatus !== 'completed') {
      order.paymentProvider = 'razorpay';
      order.paymentStatus = 'completed';
      order.orderStatus = 'confirmed';
      order.paidAt = order.paidAt || new Date();
      order.razorpayPaymentId = order.razorpayPaymentId || razorpayPaymentId;

      await adjustInventoryOnce(order);
      await order.save();
    }

    res.json({ success: true });
  } catch (error) {
    next(normalizeRazorpayError(error, 'Webhook processing failed'));
  }
});

module.exports = router;
