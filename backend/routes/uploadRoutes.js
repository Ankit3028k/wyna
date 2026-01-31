const express = require('express');
const upload = require('../middleware/upload');
const router = express.Router();

// Helper function to generate full URLs
const getFullUrl = (relativePath) => {
  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.CLIENT_URL || 'https://www.wyna.in';
    return `${baseUrl}${relativePath}`;
  }
  return relativePath;
};

// Single image upload
router.post('/single/:type?', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = getFullUrl(`/uploads/images/${req.params.type || 'general'}/${req.file.filename}`);
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// Multiple images upload
router.post('/multiple/:type?', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const imageUrls = req.files.map(file => {
      const imageUrl = getFullUrl(`/uploads/images/${req.params.type || 'general'}/${file.filename}`);
      return {
        url: imageUrl,
        filename: file.filename
      };
    });
    
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      urls: imageUrls
    });
  } catch (error) {
    console.error('Multiple image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

// Multiple products upload (specifically for product images)
router.post('/multiple/products', upload.array('images', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const imageUrls = req.files.map(file => {
      const imageUrl = getFullUrl(`/uploads/images/products/${file.filename}`);
      return {
        url: imageUrl,
        filename: file.filename
      };
    });
    
    res.json({
      success: true,
      message: `${req.files.length} product images uploaded successfully`,
      urls: imageUrls
    });
  } catch (error) {
    console.error('Multiple product upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading product images',
      error: error.message
    });
  }
});

module.exports = router;