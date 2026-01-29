const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');

// Get all images from server
router.get('/list/:type?', adminAuth, async (req, res) => {
  try {
    const type = req.params.type || 'products';
    const imagesDir = path.join(__dirname, '../uploads/images', type);
    
    // Check if directory exists
    if (!fs.existsSync(imagesDir)) {
      return res.status(404).json({
        success: false,
        message: 'Images directory not found'
      });
    }

    // Read all files in the directory
    const files = fs.readdirSync(imagesDir);
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    // Map to image objects with URLs
    const images = imageFiles.map(file => ({
      filename: file,
      url: `/uploads/images/${type}/${file}`,
      size: fs.statSync(path.join(imagesDir, file)).size,
      uploadedAt: fs.statSync(path.join(imagesDir, file)).mtime
    }));

    res.json({
      success: true,
      data: images,
      count: images.length
    });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving images',
      error: error.message
    });
  }
});

// Get all available image types/directories
router.get('/types', adminAuth, async (req, res) => {
  try {
    const imagesBaseDir = path.join(__dirname, '../uploads/images');
    
    if (!fs.existsSync(imagesBaseDir)) {
      return res.status(404).json({
        success: false,
        message: 'Images base directory not found'
      });
    }

    const directories = fs.readdirSync(imagesBaseDir).filter(item => {
      const itemPath = path.join(imagesBaseDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

    res.json({
      success: true,
      data: directories
    });
  } catch (error) {
    console.error('Error listing image types:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving image types',
      error: error.message
    });
  }
});

module.exports = router;