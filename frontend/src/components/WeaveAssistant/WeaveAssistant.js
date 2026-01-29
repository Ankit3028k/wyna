import React, { useState, useEffect } from 'react';
import './WeaveAssistant.css';

const WeaveAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'assistant', text: '👋 Namaste! I\'m your Weave Assistant. How can I help you find your perfect saree today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickResponses = [
    'Show me Banarasi sarees',
    'What\'s in Series 01?',
    'Help with sizing',
    'Customization options',
    'Shipping info'
  ];

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const responses = [
        'I\'d be happy to help you explore our exquisite Banarasi collection! Each piece is handcrafted with love.',
        'Our Series 01 features 47 unique rasi sarees with no repetitions. Would you like to see the featured pieces?',
        'We offer detailed sizing guides and personalized recommendations to ensure the perfect fit.',
        'Our Aura Weaver tool lets you customize patterns and colors. Would you like to try it?',
        'We provide secure shipping worldwide with premium packaging. Delivery typically takes 3-5 business days.'
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const assistantMessage = { type: 'assistant', text: randomResponse };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickResponse = (response) => {
    setInputValue(response);
    handleSendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Auto-open after 10 seconds
    const timer = setTimeout(() => {
      if (!isOpen) {
        setIsOpen(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className="weave-assistant">
      {/* Chat Bubble */}
      <button 
        className={`assistant-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'}`}></i>
        <span className="bubble-text">Weave Assistant</span>
        {!isOpen && <span className="pulse-dot"></span>}
      </button>

      {/* Chat Window */}
      <div className={`assistant-window ${isOpen ? 'open' : ''}`}>
        <div className="assistant-header">
          <div className="header-content">
            <div className="assistant-avatar">
              <i className="fas fa-magic"></i>
            </div>
            <div className="assistant-info">
              <h4>Weave Assistant</h4>
              <p>Always here to help</p>
            </div>
          </div>
          <button className="minimize-btn" onClick={() => setIsOpen(false)}>
            <i className="fas fa-minus"></i>
          </button>
        </div>

        <div className="assistant-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'assistant' && (
                <div className="message-avatar">
                  <i className="fas fa-magic"></i>
                </div>
              )}
              <div className="message-content">
                <p>{message.text}</p>
              </div>
              {message.type === 'user' && (
                <div className="message-avatar">
                  <i className="fas fa-user"></i>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="message assistant">
              <div className="message-avatar">
                <i className="fas fa-magic"></i>
              </div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <div className="assistant-quick-responses">
          {quickResponses.map((response, index) => (
            <button 
              key={index}
              className="quick-response-btn"
              onClick={() => handleQuickResponse(response)}
            >
              {response}
            </button>
          ))}
        </div>

        <div className="assistant-input">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about our sarees..."
              className="message-input"
            />
            <button 
              className="send-btn"
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeaveAssistant;
