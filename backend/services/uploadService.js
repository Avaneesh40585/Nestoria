const supabase = require('../config/supabase');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload image to Supabase Storage
const uploadImageToSupabase = async (file, folder = 'hotels') => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete image from Supabase Storage
const deleteImageFromSupabase = async (filePath) => {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    return {
      success: true,
      message: 'Image deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  upload,
  uploadImageToSupabase,
  deleteImageFromSupabase
};
