const path = require('path');
const multer = require('multer');
const { supabase, bucket } = require('../../config/supabase');
const { asyncHandler, badRequest, HttpError } = require('../../lib/http');

const ALLOWED = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    ALLOWED.has(file.mimetype) ? cb(null, true) : cb(new HttpError(400, 'Only JPEG, PNG or WebP images are allowed')),
});

async function uploadToSupabase(file, folder) {
  if (!supabase) throw new HttpError(503, 'Image upload is not configured');
  const ext = path.extname(file.originalname || '');
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
  const { data, error } = await supabase.storage.from(bucket).upload(key, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });
  if (error) throw new HttpError(500, `Upload failed: ${error.message}`);
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { url: pub.publicUrl, path: data.path };
}

const uploadImage = (folder) => asyncHandler(async (req, res) => {
  if (!req.file) throw badRequest('No image file provided (field name: "image")');
  const result = await uploadToSupabase(req.file, folder);
  res.status(201).json(result);
});

module.exports = { upload, uploadImage };
