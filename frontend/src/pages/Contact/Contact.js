import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-details">
              <div className="contact-item">
                <h3>Corporate Office</h3>
                {/* <p>B-107, Tower T3, NX One<br />Noida Extension, Uttar Pradesh-201306</p> */}
              </div>

              <div className="contact-item">
                <h3>Registered Address</h3>
                {/* <p>4550, Charkhewalan<br />Chawri Bazar, Delhi-110006, India</p> */}
              </div>

              <div className="contact-item">
                <h3>Support </h3>
                <p><a href="tel:+918744923702">+91 8744923702</a></p>
              </div>

              <div className="contact-item">
                <h3>Need Customized Solutions?</h3>
                <p>
                  <a href="https://wa.me/918744923702?text=Hey,%20I%20am%20looking%20for%20customized%20gifting%20solutions."
                     target="_blank"
                     rel="noopener noreferrer">
                    Chat with us on WhatsApp
                  </a>
                </p>
              </div>

              <div className="contact-item">
                <h3>Email Us</h3>
                <p><a href="Wynaindia@gmail.com">Wynaindia@gmail.com</a></p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
