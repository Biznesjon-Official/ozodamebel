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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || 'document';
    let uploadPath = 'uploads';
    
    switch (type) {
      case 'profile':
        uploadPath = 'uploads/profiles';
        break;
      case 'document':
        uploadPath = 'uploads/documents';
        break;
      case 'contract':
        uploadPath = 'uploads/contracts';
        break;
      default:
        uploadPath = 'uploads';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

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
  fileFilter: fileFilter
});

// @desc    Fayl yuklash (Base64 formatida MongoDB uchun)
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('📤 File info:', req.file);
    console.log('📤 Body info:', req.body);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'Fayl tanlanmagan'
      });
    }

    // Read file and convert to Base64
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

    // Delete the temporary file after converting to Base64
    fs.unlinkSync(req.file.path);

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      base64: base64Image,
      url: base64Image,
      filePath: base64Image
    };

    console.log('📤 File converted to Base64, size:', base64Image.length);

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