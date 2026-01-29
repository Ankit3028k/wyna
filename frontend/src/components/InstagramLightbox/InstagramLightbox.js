import React, { useEffect } from 'react';
import './InstagramLightbox.css';

const InstagramLightbox = ({ images, isOpen, onClose, currentIndex, setCurrentIndex }) => {
  const handlePrevious = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length, setCurrentIndex]);

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length, setCurrentIndex]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  }, [onClose, handlePrevious, handleNext]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className={`instagram-lightbox ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="lightbox-image-container">
          <img 
            src={images[currentIndex].src} 
            alt={images[currentIndex].alt}
            className="lightbox-image"
          />
          <div className="lightbox-overlay">
            <div className="lightbox-info">
              <i className="fab fa-instagram"></i>
              <span>{images[currentIndex].likes}</span>
            </div>
          </div>
        </div>

        <button className="lightbox-nav lightbox-prev" onClick={handlePrevious}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="lightbox-nav lightbox-next" onClick={handleNext}>
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="lightbox-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={image.src} alt={image.alt} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstagramLightbox;
