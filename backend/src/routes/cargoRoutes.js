const express = require('express');
const multer = require('multer');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');
const { uploadManifest, listCargo } = require('../controllers/cargoController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const isText =
      file.mimetype === 'text/plain' || file.originalname.toLowerCase().endsWith('.txt');
    if (isText) {
      cb(null, true);
    } else {
      cb(new Error('Only manifest.txt text files are allowed.'));
    }
  },
});

router.post(
  '/api/upload',
  authenticate,
  requireAdmin,
  upload.single('file'),
  uploadManifest
);

router.get('/api/cargo', authenticate, listCargo);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
