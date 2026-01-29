import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="container">
        <div className="privacy-policy-content">
          <h1>WYNA INDIA — PRIVACY POLICY</h1>
          <p className="last-updated">Last Updated: 22 January 2026</p>

          <p>Wyna India (operated by Shrinaya Parampara) provides this online store, website, and related services ("Services") to offer a curated and premium shopping experience for our customers. This Privacy Policy describes how we collect, use, store, process, and disclose your personal information when you visit, interact with, or make purchases through our Services.</p>

          <p>By accessing or using the Services, you acknowledge that you have read this Privacy Policy and understand how your personal data is collected, processed, and disclosed as described herein. If any conflict exists between our Terms of Service and this Privacy Policy regarding personal information, this Privacy Policy shall prevail.</p>

          <section className="policy-section">
            <h2>1. Personal Information We Collect</h2>
            <p>"Personal Information" refers to information that identifies, relates to, or can reasonably be associated with an individual. Personal Information does not include anonymous or de-identified data.</p>
            
            <p>Depending on how you interact with the Services, we may collect the following categories of information:</p>
            
            <h3>Contact Information:</h3>
            <p>Name, mobile number, email address, billing and shipping address.</p>
            
            <h3>Payment & Financial Information:</h3>
            <p>Credit/debit card details, UPI/payment confirmations, transaction records.<br />
            <em>(Note: Payment data is handled by third-party payment gateways and is not stored in plain form.)</em></p>
            
            <h3>Account Information (If Applicable):</h3>
            <p>Usernames, passwords, preferences, past orders, saved carts, wishlist.</p>
            
            <h3>Transaction Data:</h3>
            <p>Items viewed, added to cart, purchased, returned, exchanged, canceled.</p>
            
            <h3>Communications & Support:</h3>
            <p>Queries via WhatsApp, email, chat, or other communication mediums.</p>
            
            <h3>Device & Usage Data:</h3>
            <p>Browser type, device type, IP address, network information, unique identifiers, session logs.</p>
            
            <h3>Cookies & Tracking:</h3>
            <p>Session cookies, analytics cookies, performance trackers used to improve user experience.</p>
          </section>

          <section className="policy-section">
            <h2>2. Sources of Personal Information</h2>
            <p>We may collect information:</p>
            <ul>
              <li>Directly from you (account creation, order placement, support requests, etc.)</li>
              <li>Automatically (via cookies, device logs, or browser data)</li>
              <li>Through third-party service providers (payments, logistics, analytics, hosting)</li>
              <li>From partners and marketing platforms (subject to consent & law)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Personal Information</h2>
            <p>We may process your Personal Information to:</p>
            
            <h3>Provide & Improve Services:</h3>
            <p>Fulfill orders, process payments, manage returns/exchanges, save preferences, facilitate delivery, and enhance shopping experience.</p>
            
            <h3>Customer Support & Communications:</h3>
            <p>Answer queries, update order status, transactional notifications.</p>
            
            <h3>Marketing & Promotions:</h3>
            <p>Send promotional SMS, WhatsApp, email, or show product ads (subject to opt-out rights).</p>
            
            <h3>Security & Fraud Prevention:</h3>
            <p>Authenticate accounts, detect suspicious activities, mitigate fraud, ensure secure checkout.</p>
            
            <h3>Legal & Compliance:</h3>
            <p>Comply with statutory requirements, respond to lawful requests, audits, taxation, or enforcement actions.</p>
          </section>

          <section className="policy-section">
            <h2>4. Disclosure of Personal Information</h2>
            <p>We may disclose Personal Information to authorized parties including:</p>
            <ul>
              <li>Payment Processors & Gateways</li>
              <li>Logistics & Shipping Providers</li>
              <li>IT, Analytics & Cloud Vendors</li>
              <li>Marketing & Advertising Platforms</li>
              <li>Affiliates & Group Entities</li>
              <li>Regulatory Authorities (if law requires)</li>
              <li>In a merger/acquisition or business restructuring</li>
            </ul>
            <p>We do not sell customer data.</p>
          </section>

          <section className="policy-section">
            <h2>5. Third-Party Platforms & Services</h2>
            <p>Services may contain links to third-party platforms (e.g., social media integrations, analytics dashboards, payment gateways). We do not control and are not responsible for the privacy practices of such external platforms. Users are encouraged to review their respective privacy notices.</p>
          </section>

          <section className="policy-section">
            <h2>6. Children's Data</h2>
            <p>Our Services are intended for adults. We do not knowingly collect data from minors under the age of 18. If you believe a minor has submitted data, contact us to delete such information.</p>
          </section>

          <section className="policy-section">
            <h2>7. Security & Data Retention</h2>
            <p>We implement reasonable technical and organizational safeguards to protect Personal Information. However, no system can guarantee absolute security.</p>
            <p>Retention of personal data depends on business needs including order history, compliance, fraud prevention, and legal requirements.</p>
          </section>

          <section className="policy-section">
            <h2>8. User Rights & Choices</h2>
            <p>Depending on your jurisdiction, you may have rights to:</p>
            <ul>
              <li>✔ Access / Request your data</li>
              <li>✔ Correct inaccuracies</li>
              <li>✔ Request deletion (where legally permissible)</li>
              <li>✔ Opt-out of promotional communications</li>
            </ul>
            <p>Promotional messaging opt-out is available via unsubscribe links or communication to support.</p>
          </section>

          <section className="policy-section">
            <h2>9. International Transfers (If Applicable)</h2>
            <p>Data may be stored or processed outside your jurisdiction due to cloud hosting, logistics, or technology providers. Such transfers will follow lawful data protection frameworks where required.</p>
          </section>

          <section className="policy-section">
            <h2>10. Changes to this Privacy Policy</h2>
            <p>We may update or modify this Privacy Policy for operational, regulatory, or legal reasons. Updates will be posted on this page with a revised "Last Updated" date. Continued use of Services constitutes acceptance.</p>
          </section>

          <section className="policy-section">
            <h2>11. Contact</h2>
            <p>For privacy-related inquiries, data requests, or complaints, contact us:</p>
            <ul>
              <li>📧 Email: <a href="mailto:hellowynashop@gmail.com">hellowynashop@gmail.com</a></li>
              <li>📞 Phone: <a href="tel:+918744923702">+91 87449 23702</a></li>
            </ul>
            <p>🏢 Company: Shrinaya Parampara (Wyna India)<br />
            Hours: Mon–Sat (Business Hours)</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;