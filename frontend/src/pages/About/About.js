import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>About WYNA</h1>
          <h2 className="tagline">WHERE TRADITION MEETS TIMELESS LUXURY</h2>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h3>About WYNA</h3>
            <p>
              WYNA, an acronym for Weave Your New Aura, is a premium traditional
              Indian saree brand under Shrinaya Parampara (Since 2025), founded
              by Mrs. Garima Singh.
            </p>
            <p>
              The brand embodies the belief that a saree is not just attire, but
              an aura — woven with heritage, elegance, and individuality. WYNA
              curates exclusive, one-of-a-kind creations that allow every woman
              to express her unique presence with grace and confidence.
            </p>
          </section>

          <section className="about-section owner-statement">
            <h3>Owner Statement</h3>
            <div className="owner-content">
              <div className="owner-image-container">
                <img
                  src="/Asset/owner-image.jpeg"
                  alt="Mrs. Garima Singh - Founder of WYNA"
                  className="owner-image"
                />
              </div>
              <div className="owner-text">
                <p>
                  WYNA, an acronym for Weave Your New Aura, is a premium
                  traditional Indian saree brand under Shrinaya Parampara (Since
                  2025), founded by Mrs. Garima Singh.
                </p>
                <p>
                  The brand embodies the belief that a saree is not just attire,
                  but an aura — woven with heritage, elegance, and
                  individuality. WYNA curates exclusive, one-of-a-kind creations
                  that allow every woman to express her unique presence with
                  grace and confidence.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section founder">
            <h3>Our Founder</h3>
            <p>
              <strong>Founder of WYNA:</strong> Mrs. Garima Singh
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
