import React, { useState, useEffect } from 'react';
import API_CONFIG from '../../config/api';
import './ImageSelector.css';

const ImageSelector = ({ 
  selectedImages = [], 
  onImagesChange, 
  onClose, 
  maxImages = 10,
  imageType = 'products'
}) => {
  const [availableImages, setAvailableImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageTypes, setImageTypes] = useState([]);
  const [selectedImageType, setSelectedImageType] = useState(imageType);
  const [localSelectedImages, setLocalSelectedImages] = useState([...selectedImages]);
  // const [viewMode, setViewMode] = useState('gallery'); // gallery or upload

  // Fetch available images from server
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch(
          API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.IMAGES_LIST(selectedImageType)), 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const data = await response.json();
        
        if (data.success) {
          setAvailableImages(data.data);
        } else {
          setError(data.message || 'Failed to fetch images');
        }
      } catch (err) {
        setError('Error fetching images from server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedImageType]);

  // Fetch available image types
  useEffect(() => {
    const fetchImageTypes = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        const response = await fetch(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.IMAGES_TYPES), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setImageTypes(data.data);
        }
      } catch (err) {
        console.error('Error fetching image types:', err);
      }
    };

    fetchImageTypes();
  }, []);

  const handleImageSelect = (image) => {
    if (localSelectedImages.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Check if image is already selected
    if (!localSelectedImages.some(img => img.url === image.url)) {
      setLocalSelectedImages([
        ...localSelectedImages,
        {
          url: image.url,
          alt: image.filename.replace(/\.[^/.]+$/, ""), // Remove extension from filename
          isPrimary: localSelectedImages.length === 0 // Make first image primary
        }
      ]);
    }
  };

  const handleImageRemove = (indexToRemove) => {
    const updatedImages = localSelectedImages.filter((_, index) => index !== indexToRemove);
    setLocalSelectedImages(updatedImages);

    // If removing the primary image, make the first remaining image primary
    if (indexToRemove === 0 && updatedImages.length > 0) {
      const fixedImages = updatedImages.map((img, idx) => ({
        ...img,
        isPrimary: idx === 0
      }));
      setLocalSelectedImages(fixedImages);
    }
  };

  const handlePrimaryToggle = (index) => {
    const updatedImages = localSelectedImages.map((img, idx) => ({
      ...img,
      isPrimary: idx === index
    }));
    setLocalSelectedImages(updatedImages);
  };

  const handleSave = () => {
    onImagesChange(localSelectedImages);
    onClose();
  };

  // const handleUploadSuccess = (uploadedImages) => {
  //   // Add newly uploaded images to the selected images
  //   const newImages = uploadedImages.map(img => ({
  //     url: img.url,
  //     alt: 'Uploaded image',
  //     isPrimary: localSelectedImages.length === 0 // Make first image primary if no primary exists
  //   }));
  //   
  //   setLocalSelectedImages([...localSelectedImages, ...newImages]);
  // };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="image-selector-overlay">
        <div className="image-selector-modal">
          <div className="image-selector-header">
            <h3>Select Images</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="image-selector-content">
            <div className="loading-spinner">Loading images...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-selector-overlay">
      <div className="image-selector-modal">
        <div className="image-selector-header">
          <h3>Select Images</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="image-selector-content">
          {/* Controls */}
          <div className="image-controls">
            <div className="control-group">
              <label htmlFor="image-type">Image Type:</label>
              <select 
                id="image-type"
                value={selectedImageType}
                onChange={(e) => setSelectedImageType(e.target.value)}
              >
                {imageTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="selected-count">
              Selected: {localSelectedImages.length}/{maxImages}
            </div>
          </div>

          {/* Selected Images Preview */}
          {localSelectedImages.length > 0 && (
            <div className="selected-images-preview">
              <h4>Selected Images</h4>
              <div className="selected-images-list">
                {localSelectedImages.map((img, index) => (
                  <div key={index} className="selected-image-item">
                    <img src={`${API_CONFIG.BASE_URL}${img.url}`} alt={img.alt} />
                    <div className="image-actions">
                      <button 
                        className={`primary-btn ${img.isPrimary ? 'active' : ''}`}
                        onClick={() => handlePrimaryToggle(index)}
                        title="Set as Primary"
                      >
                        {img.isPrimary ? '★' : '☆'}
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => handleImageRemove(index)}
                        title="Remove Image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Images Gallery */}
          <div className="available-images-section">
            <h4>Available Images</h4>
            {error && <div className="error-message">{error}</div>}
            
            {availableImages.length === 0 ? (
              <div className="no-images-message">No images available in this category</div>
            ) : (
              <div className="available-images-grid">
                {availableImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="image-item"
                    onClick={() => handleImageSelect(image)}
                  >
                    <img 
                      src={`${API_CONFIG.BASE_URL}${image.url}`} 
                      alt={image.filename} 
                      className="thumbnail"
                    />
                    <div className="image-info">
                      <div className="filename">{image.filename}</div>
                      <div className="file-size">{formatFileSize(image.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="image-selector-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="save-btn" 
              onClick={handleSave}
              disabled={localSelectedImages.length === 0}
            >
              Save Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSelector;