const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/* ===================== ORDER CONFIRMATION ===================== */

const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color:#f3f3f3; padding:30px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.08); overflow:hidden;">

        <!-- Header -->
        <div style="text-align:center; padding:30px 20px; border-bottom:1px solid #eee;">
          <img src="https://res.cloudinary.com/dtezcrxpw/image/upload/v1770548986/logo_nlrqho.jpg" alt="WYNA India" style="max-width:140px; margin-bottom:10px;" />
          <h1 style="margin:0; color:#b89b5e; letter-spacing:1px;">WYNA India</h1>
          <p style="margin:5px 0 0; color:#777; font-size:14px;">Wave Your New Aura</p>
        </div>

        <!-- Body -->
        <div style="padding:30px;">
          <h2 style="border-bottom:2px solid #d4af37; padding-bottom:10px;">Order Confirmation</h2>

          <p>Dear ${user.name},</p>
          <p>Thank you for your order! We’re delighted to confirm that your order has been received and is being processed.</p>

          <!-- Order Info -->
          <div style="background:#fafafa; padding:15px; border-radius:8px; margin:20px 0;">
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
          </div>

          <!-- Shipping -->
          <h3>Shipping Address</h3>
          <div style="background:#fafafa; padding:15px; border-radius:8px;">
            <p><strong>${order.shippingAddress.fullName}</strong></p>
            <p>${order.shippingAddress.street}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            <p>${order.shippingAddress.country}</p>
            <p>Phone: ${order.shippingAddress.phone}</p>
          </div>

          <!-- Items -->
          <h3 style="margin-top:30px;">Order Items</h3>
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="background:#d4af37; color:#fff;">
                <th style="padding:10px; text-align:left;">Product</th>
                <th style="padding:10px; text-align:center;">Qty</th>
                <th style="padding:10px; text-align:right;">Price</th>
                <th style="padding:10px; text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:10px;">${item.name}</td>
                  <td style="padding:10px; text-align:center;">${item.quantity}</td>
                  <td style="padding:10px; text-align:right;">₹${item.price.toFixed(2)}</td>
                  <td style="padding:10px; text-align:right;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Summary -->
          <div style="margin-top:30px; background:#fafafa; padding:20px; border-radius:8px;">
            <h3>Order Summary</h3>

            <div style="display:flex; justify-content:space-between;">
              <span>Subtotal</span>
              <span>₹${order.subtotal.toFixed(2)}</span>
            </div>

            <div style="display:flex; justify-content:space-between;">
              <span>Shipping</span>
              <span>${order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toFixed(2)}`}</span>
            </div>

            ${order.discount > 0 ? `
            <div style="display:flex; justify-content:space-between; color:#2e7d32;">
              <span>Discount</span>
              <span>-₹${order.discount.toFixed(2)}</span>
            </div>` : ''}

            <hr style="border:none; border-top:1px solid #d4af37; margin:15px 0;" />

            <div style="display:flex; justify-content:space-between; font-size:18px; font-weight:600;">
              <span>Total Amount</span>
              <span style="color:#b89b5e;">₹${order.totalAmount.toFixed(2)}</span>
            </div>

            <p style="font-size:12px; color:#777; margin-top:10px;">
              * Prices are inclusive of all charges. No additional taxes will be applied.
            </p>
          </div>

          <p style="margin-top:30px;">You will receive updates as your order progresses.</p>
        </div>

        <!-- Footer -->
        <div style="text-align:center; padding:20px; font-size:12px; color:#777; border-top:1px solid #eee;">
          This is an automated email. Please do not reply.<br/>
          © 2024 WYNA. All rights reserved.
        </div>

      </div>
    </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: emailContent,
    });

  } catch (error) {
    console.error('Order confirmation email error:', error);
    throw error;
  }
};

/* ===================== STATUS UPDATE ===================== */

const sendOrderStatusUpdateEmail = async (order, user) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
    <div style="font-family: Arial, sans-serif; background:#f3f3f3; padding:30px;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <div style="text-align:center; padding:30px;">
          <img src="hello ankit" style="max-width:120px; margin-bottom:10px;" />
          <h2 style="color:#b89b5e;">Order Status Update</h2>
        </div>

        <div style="padding:20px;">
          <p>Dear ${user.name},</p>
          <p>Your order status has been updated.</p>

          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Status:</strong> <span style="color:#b89b5e; font-weight:bold;">${order.orderStatus}</span></p>

          ${order.trackingNumber ? `
          <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
          ` : ''}
        </div>

        <div style="text-align:center; font-size:12px; padding:20px; color:#777;">
          © 2024 WYNA. All rights reserved.
        </div>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Status Update - ${order.orderNumber}`,
      html: emailContent,
    });

  } catch (error) {
    console.error('Status update email error:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
