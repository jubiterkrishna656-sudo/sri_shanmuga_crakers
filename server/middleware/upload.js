const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024;
const MAX_DIMENSION = 800;
const WEBP_QUALITY = 80;

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname).toLowerCase())
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_SIZE } });

const processImage = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const src = req.file.path;
    const outPath = src.replace(path.extname(src), '.webp');
    await sharp(src)
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outPath);
    fs.unlinkSync(src);
    req.file.path = outPath;
    req.file.filename = path.basename(outPath);
    req.file.mimetype = 'image/webp';
  } catch {
    // The file is not a valid image (or conversion failed) — remove it rather
    // than serving an unvalidated file to visitors.
    try { fs.unlinkSync(req.file.path); } catch { /* already gone */ }
    return next(new Error('Image processing failed. Please upload a valid image file.'));
  }
  next();
};

module.exports = upload;
module.exports.processImage = processImage;
