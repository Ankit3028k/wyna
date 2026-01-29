import React from "react";
import "./ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    <div className="shipping-policy-page">
      <div className="container">
        <div className="shipping-policy-content">
          <h1>Wyna India — Shipping Policy</h1>

          <section className="policy-section">
            <h2>Order Processing Time</h2>
            <p>All orders are processed within 1–2 business days of successful payment.</p>
            <p>Orders placed on weekends or public holidays will be processed on the next working day.</p>
          </section>

          <section className="policy-section">
            <h2>Shipping Time</h2>
            <p>Domestic delivery timelines vary by location:</p>
            <ul>
              <li><strong>Metro Cities:</strong> 3–6 business days</li>
              <li><strong>Tier 1 & Tier 2 Cities:</strong> 4–7 business days</li>
              <li><strong>Remote / Rural Areas:</strong> 7–10 business days</li>
            </ul>
            <p>(Note: Unexpected delays due to logistics, weather, or courier restrictions may extend delivery time.)</p>
          </section>

          <section className="policy-section">
            <h2>Shipping Partners</h2>
            <p>Orders are shipped through trusted delivery partners across India.</p>
            <p>Tracking details will be shared via SMS/Email/WhatsApp once dispatched.</p>
          </section>

          <section className="policy-section">
            <h2>Order Tracking</h2>
            <p>Once your order is shipped, a tracking link will be sent so you can monitor delivery status in real-time.</p>
          </section>

          <section className="policy-section">
            <h2>Delivery Attempts</h2>
            <p>If the courier is unable to deliver your parcel, they will attempt 2–3 delivery attempts before marking the order as returned.</p>
          </section>

          <section className="policy-section">
            <h2>Address & Contact Information Accuracy</h2>
            <p>Please ensure the shipping address and contact details entered at checkout are correct. We are not responsible for delays or failed deliveries due to incorrect information.</p>
          </section>

          <section className="policy-section">
            <h2>COVID / Weather / Festival Delay Clause</h2>
            <p>During exceptional periods (COVID-related restrictions, adverse weather conditions, or heavy festival seasons), deliveries may take longer than usual due to unavoidable logistics disruptions.</p>
          </section>

          <section className="policy-section">
            <h2>International Shipping</h2>
            <p>Currently, Wyna India ships within India only.</p>
          </section>

          <section className="policy-section">
            <h2>Customer Support</h2>
            <p>For any shipping-related queries, contact our support team:</p>
            <ul>
              <li>📧 Email: <a href="mailto:hellowynashop@gmail.com">hellowynashop@gmail.com</a></li>
              <li>📞 Phone/WhatsApp: <a href="tel:+918744923702">+91 8744923702</a></li>
            </ul>
          </section>

          <section className="policy-section">
            <p><strong>Note:</strong> This Shipping Policy is subject to change without prior notice. Updated policies will always be available on our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;