import React, { useState, useEffect } from "react";
import "./AnimatedHero.css";

const AnimatedHero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const words = ["Elegance", "Tradition", "Luxury", "Heritage", "Aura"];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <section className={`animated-hero ${isVisible ? "visible" : ""}`}>
      <div className="floating-blob floating-blob-1"></div>
      <div className="floating-blob floating-blob-2"></div>
      <div className="floating-blob floating-blob-3"></div>
      <div className="grid-background"></div>

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-title-container">
            <h1 className="hero-title">
              WYNA
              <span className="highlight"> Weave Your New Aura</span>
            </h1>
            <div className="animated-words">
              <span className="word-prefix">Building</span>
              <span className="word-animated">{words[currentWord]}</span>
            </div>
          </div>

          <p className="hero-subtitle">
            Where tradition meets timeless luxury. Each saree is not just
            attire, but an aura — woven with heritage, elegance, and
            individuality. Experience exclusive, one-of-a-kind creations curated
            for the discerning woman.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">47</span>
              <span className="stat-label">Unique Articles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">11</span>
              <span className="stat-label">Variants</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Handcrafted</span>
            </div>
          </div>

          <div className="hero-buttons">
            <a
              href="/Asset/Wyna Catalogue Profile_compressed.pdf"
              download
              className="btn btn-primary hover-scale"
            >
              <i className="fas fa-shopping-bag"></i>
              DOWNLOAD CATTALOGUE
            </a>
            <a href="/about" className="btn btn-outline hover-lift">
              <i className="fas fa-play-circle"></i>
              Watch Story
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-container">
            {/* <img
              src="/Asset/model.png"
              alt="WYNA - Premium Ethnic Wear"
              className="hero-image animate-float"
            /> */}
            {/* <div className="image-glow"></div> */}
          </div>

          <div className="floating-elements">
            <div className="floating-element element-1 animate-float">
              <i className="fas fa-gem"></i>
            </div>
            <div className="floating-element element-2 animate-float">
              <i className="fas fa-crown"></i>
            </div>
            <div className="floating-element element-3 animate-float">
              <i className="fas fa-heart"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero;
