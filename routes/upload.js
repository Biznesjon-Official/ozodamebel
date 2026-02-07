const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/profiles', 'uploads/documents', 'uploads/contracts'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads - store in memory for Base64 conversion
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Faqat rasm va hujjat fayllariga ruxsat berilgan'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max per file
  }
});

// @desc    Fayl yuklash
// @route   POST /api/upload
// @access  Private
router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('📤 Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Fayl hajmi juda katta (maksimal 10MB)'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Fayl yuklashda xatolik: ${err.message}`
      });
    } else if (err) {
      console.error('📤 Upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Fayl yuklashda xatolik'
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('📤 File info:', req.file ? 'File present' : 'No file');
    console.log('📤 Body info:', req.body);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Fayl tanlanmagan'
      });
    }

    // Convert file buffer to Base64
    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const base64Image = `data:${mimeType};base64,${base64Data}`;

    console.log('📤 File converted to Base64, size:', base64Image.length, 'characters');

    const fileInfo = {
      filename: req.file.originalname,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: base64Image,
      filePath: base64Image
    };

    console.log('📤 File uploaded successfully as Base64');

    res.json({
      success: true,
      message: 'Fayl muvaffaqiyatli yuklandi',
      file: fileInfo,
      filePath: base64Image,
      url: base64Image
    });
  } catch (error) {
    console.error('📤 Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Bir nechta fayl yuklash
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Fayllar tanlanmagan'
      });
    }

    const filesInfo = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${req.body.type || 'documents'}/${file.filename}`
    }));

    res.json({
      success: true,
      message: 'Fayllar muvaffaqiyatli yuklandi',
      files: filesInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Faylni o'chirish
// @route   DELETE /api/upload/:filename
// @access  Private
router.delete('/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    const { type = 'documents' } = req.query;
    
    const filePath = path.join(__dirname, `../uploads/${type}`, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Fayl o\'chirildi'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Fayl topilmadi'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;