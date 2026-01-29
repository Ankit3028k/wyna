import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './FirstVisitConfetti.css';

const FirstVisitConfetti = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    // Show party effect for everyone on every visit
    setShowConfetti(true);
    setShowWelcome(true);
    
    // Stop confetti after 6 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
    
    // Hide welcome message after 6 seconds
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 6000);
    
    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(welcomeTimer);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={300}
          recycle={false}
          colors={['#FFD700', '#FFA500', '#FF6347', '#DC143C', '#B8860B', '#DAA520', '#FF4500', '#8B0000']}
        />
      )}
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-message">
            <h1 className="welcome-title">🎉 Welcome to Our Store! 🎉</h1>
            <p className="welcome-subtitle">Discover Exquisite Handcrafted Sarees</p>
          </div>
        </div>
      )}
    </>
  );
};

export default FirstVisitConfetti;
