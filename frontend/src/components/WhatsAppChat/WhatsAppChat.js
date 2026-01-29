import React, { useState } from "react";
import "./WhatsAppChat.css";

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "918744923702"; // +91 87449 23702
  const message = "Hello WYNA! I would like to know more about your products.";

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="whatsapp-chat-container">
      {/* Chat Box */}
      {isOpen && (
        <div className="whatsapp-chat-box">
          <div className="chat-header">
            <h3>WYNA Support</h3>
            <button
              className="close-btn"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div className="chat-content">
            <p className="welcome-message">
              👋 Hello! Welcome to WYNA. How can we help you today?
            </p>
            <p className="phone-display">
              <i className="fas fa-phone"></i> +91 87449 23702
            </p>
          </div>
          <button className="whatsapp-btn-main" onClick={handleWhatsAppClick}>
            <i className="fab fa-whatsapp"></i> Start Chat on WhatsApp
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        className={`whatsapp-floating-btn ${isOpen ? "open" : ""}`}
        onClick={toggleChat}
        title="Chat with us on WhatsApp"
        aria-label="WhatsApp chat"
      >
        <i className="fab fa-whatsapp"></i>
        {!isOpen && <span className="pulse"></span>}
      </button>
    </div>
  );
};

export default WhatsAppChat;
