const nodemailer = require('nodemailer');

/* ===================== TRANSPORTER ===================== */

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
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
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f3f3f3;
    font-family: Arial, Helvetica, sans-serif;
  }

  table {
    border-collapse: collapse;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  @media only screen and (max-width: 600px) {
    .container {
      width: 100% !important;
    }

    .mobile-padding {
      padding: 15px !important;
    }

    .text-center {
      text-align: center !important;
    }

    .font-small {
      font-size: 14px !important;
    }
  }
</style>
</head>

<body>
<table width="100%" bgcolor="#f3f3f3" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" class="container" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr>
    <td align="center" style="padding:30px 20px; border-bottom:1px solid #eee;">
      <img src="https://res.cloudinary.com/dtezcrxpw/image/upload/v1770548986/logo_nlrqho.jpg" width="140" alt="WYNA India" />
      <h1 style="margin:10px 0 0; color:#b89b5e;">WYNA India</h1>
      <p style="margin:5px 0 0; font-size:14px; color:#777;">Wave Your New Aura</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td class="mobile-padding" style="padding:30px;">

      <h2 style="border-bottom:2px solid #d4af37; padding-bottom:10px;">Order Confirmation</h2>

      <p>Dear ${user.name},</p>
      <p>Thank you for your order! Your order has been successfully received and is being processed.</p>

      <!-- Order Info -->
      <table width="100%" bgcolor="#fafafa" cellpadding="12" cellspacing="0" style="border-radius:8px;">
        <tr>
          <td class="font-small">
            <strong>Order Number:</strong> ${order.orderNumber}<br/>
            <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br/>
            <strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}
          </td>
        </tr>
      </table>

      <!-- Shipping -->
      <h3 style="margin-top:25px;">Shipping Address</h3>
      <table width="100%" bgcolor="#fafafa" cellpadding="12" cellspacing="0" style="border-radius:8px;">
        <tr>
          <td class="font-small">
            <strong>${order.shippingAddress.fullName}</strong><br/>
            ${order.shippingAddress.street}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br/>
            ${order.shippingAddress.country}<br/>
            Phone: ${order.shippingAddress.phone}
          </td>
        </tr>
      </table>

      <!-- Items -->
      <h3 style="margin-top:25px;">Order Items</h3>
      <table width="100%" cellpadding="10" cellspacing="0" border="1" style="border-color:#eee;">
        <tr bgcolor="#d4af37" style="color:#ffffff;">
          <th align="left">Product</th>
          <th align="center">Qty</th>
          <th align="right">Total</th>
        </tr>

        ${order.items.map(item => `
        <tr>
          <td>${item.name}</td>
          <td align="center">${item.quantity}</td>
          <td align="right">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
        `).join('')}
      </table>

      <!-- Summary -->
      <table width="100%" bgcolor="#fafafa" cellpadding="12" cellspacing="0" style="margin-top:25px; border-radius:8px;">
        <tr>
          <td>Subtotal</td>
          <td align="right">₹${order.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Shipping</td>
          <td align="right">${order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toFixed(2)}`}</td>
        </tr>

        ${order.discount > 0 ? `
        <tr style="color:#2e7d32;">
          <td>Discount</td>
          <td align="right">-₹${order.discount.toFixed(2)}</td>
        </tr>` : ''}

        <tr>
          <td colspan="2" style="border-top:2px solid #d4af37;"></td>
        </tr>

        <tr style="font-size:18px; font-weight:bold;">
          <td>Total Amount</td>
          <td align="right" style="color:#b89b5e;">₹${order.totalAmount.toFixed(2)}</td>
        </tr>
      </table>

      <p style="margin-top:25px;">You will receive updates as your order progresses.</p>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td align="center" style="padding:20px; font-size:12px; color:#777; border-top:1px solid #eee;">
      This is an automated email. Please do not reply.<br/>
      © 2024 WYNA. All rights reserved.
    </td>
  </tr>

</table>

</td>
</tr>
</table>
</body>
</html>
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
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0; padding:0; background:#f3f3f3; font-family:Arial;">
<table width="100%" bgcolor="#f3f3f3">
<tr>
<td align="center">

<table width="600" bgcolor="#ffffff" style="border-radius:12px;">
<tr>
<td align="center" style="padding:30px;">
  <img src="https://res.cloudinary.com/dtezcrxpw/image/upload/v1770548986/logo_nlrqho.jpg" width="120" />
  <h2 style="color:#b89b5e;">Order Status Update</h2>
</td>
</tr>

<tr>
<td style="padding:20px;">
  <p>Dear ${user.name},</p>
  <p>Your order status has been updated.</p>

  <p><strong>Order Number:</strong> ${order.orderNumber}</p>
  <p><strong>Status:</strong> <span style="color:#b89b5e; font-weight:bold;">${order.orderStatus}</span></p>

  ${order.trackingNumber ? `
  <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
</td>
</tr>

<tr>
<td align="center" style="padding:20px; font-size:12px; color:#777;">
  © 2024 WYNA. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>
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
