const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload papkasini yaratish
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Fayl saqlash konfiguratsiyasi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { type } = req.body;
    let folder = 'documents';
    
    switch (type) {
      case 'passport_main':
      case 'passport_registration':
        folder = 'passports';
        break;
      case 'selfie':
        folder = 'selfies';
        break;
      case 'product_photo':
        folder = 'products';
        break;
      default:
        folder = 'documents';
    }
    
    const fullPath = path.join(uploadDir, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Fayl filtri
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Faqat JPEG, JPG, PNG va PDF fayllar ruxsat etilgan'));
  }
};

// Multer konfiguratsiyasi
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

// Xatoliklarni boshqarish
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'Fayl hajmi juda katta (maksimal 10MB)' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Juda ko\'p fayl yuklandi' 
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
};

module.exports = { upload, handleUploadError };