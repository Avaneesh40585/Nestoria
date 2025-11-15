const express = require('express');
const router = express.Router();
const { upload, uploadImageToSupabase } = require('../services/uploadService');
const { authenticateToken } = require('../middleware/authMiddleware');

// Upload hotel image
router.post('/hotel-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('📤 Uploading hotel image:', req.file.originalname);

    const result = await uploadImageToSupabase(req.file, 'hotels');

    if (!result.success) {
      return res.status(500).json({ 
        error: 'Failed to upload image', 
        details: result.error 
      });
    }

    console.log('✅ Image uploaded successfully:', result.url);

    res.json({
      message: 'Image uploaded successfully',
      url: result.url,
      path: result.path
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error.message 
    });
  }
});

// Upload room image
router.post('/room-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('📤 Uploading room image:', req.file.originalname);

    const result = await uploadImageToSupabase(req.file, 'rooms');

    if (!result.success) {
      return res.status(500).json({ 
        error: 'Failed to upload image', 
        details: result.error 
      });
    }

    console.log('✅ Image uploaded successfully:', result.url);

    res.json({
      message: 'Image uploaded successfully',
      url: result.url,
      path: result.path
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image', 
      details: error.message 
    });
  }
});

module.exports = router;
