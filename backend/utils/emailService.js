const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // Only true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};
 
const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; margin: 0;">WYNA Saree</h1>
            <p style="color: #666; margin: 5px 0;">Exquisite Saree for Every Occasion</p>
          </div>
          
          <h2 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Order Confirmation</h2>
          
          <p>Dear ${user.name},</p>
          <p>Thank you for your order! We're pleased to confirm that your order has been received and is being processed.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
            <p><strong>Order Status:</strong> <span style="color: #28a745; font-weight: bold;">${order.orderStatus.toUpperCase()}</span></p>
          </div>
          
          <h3 style="color: #333;">Shipping Address</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <p style="margin: 5px 0;"><strong>${order.shippingAddress.fullName}</strong></p>
            <p style="margin: 5px 0;">${order.shippingAddress.street}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
            <p style="margin: 5px 0;">Phone: ${order.shippingAddress.phone}</p>
          </div>
          
          <h3 style="color: #333;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #d4af37; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Quantity</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px;">${item.name}</td>
                  <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="padding: 10px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Subtotal:</span>
              <span>₹${order.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Tax (18%):</span>
              <span>₹${order.tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span>Shipping:</span>
              <span>${order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toFixed(2)}`}</span>
            </div>
            ${order.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin: 5px 0; color: #28a745;">
                <span>Discount:</span>
                <span>-₹${order.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin: 15px 0 0 0; padding-top: 15px; border-top: 2px solid #d4af37; font-weight: bold; font-size: 18px;">
              <span>Total Amount:</span>
              <span style="color: #d4af37;">₹${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #333;">What's Next?</h3>
            <p style="color: #666;">You will receive updates as your order progresses through processing, shipping, and delivery.</p>
            <p style="color: #666;">For any questions, please contact our customer support.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply to this message.<br>
              © 2024 WYNA . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

const sendOrderStatusUpdateEmail = async (order, user) => {
  try {
    const transporter = createTransporter();

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: linear-gradient(135deg, #8b0000 0%, #b22222 100%); margin: 0;">WYNA Saree</h1>
            <p style="color: #666; margin: 5px 0;">Exquisite Saree for Every Occasion</p>
          </div>
          
          <h2 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Order Status Update</h2>
          
          <p>Dear ${user.name},</p>
          <p>Your order status has been updated. Here are the details:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order Information</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>New Status:</strong> <span style="color: #d4af37; font-weight: bold; text-transform: uppercase;">${order.orderStatus}</span></p>
            <p><strong>Updated Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          ${order.trackingNumber ? `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #28a745; margin-top: 0;">Tracking Information</h3>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <p>You can track your order using the above tracking number on our website or the courier's website.</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">Thank you for choosing WYNA Saree!</p>
            <p style="color: #666;">For any questions, please contact our customer support.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply to this message.<br>
              © 2024 WYNA . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Status Update - ${order.orderNumber}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
