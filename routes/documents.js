const express = require('express');
const { upload, handleUploadError } = require('../middleware/upload');
const { protect, auditLog } = require('../middleware/auth');
const Guarantor = require('../models/Guarantor');

const router = express.Router();

// @desc    Fayl yuklash
// @route   POST /api/documents/upload
// @access  Private
router.post('/upload', protect, upload.single('file'), handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Fayl tanlanmadi' 
      });
    }

    const { type, entityType, entityId } = req.body;

    const documentData = {
      type,
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadDate: new Date()
    };

    // Kafilga hujjat qo'shish
    if (entityType === 'guarantor') {
      await Guarantor.findByIdAndUpdate(
        entityId,
        { $push: { documents: documentData } }
      );
    }

    res.json({
      success: true,
      message: 'Fayl muvaffaqiyatli yuklandi',
      document: documentData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fayl o'chirish
// @route   DELETE /api/documents/:entityType/:entityId/:documentId
// @access  Private
router.delete('/:entityType/:entityId/:documentId', protect, async (req, res) => {
  try {
    const { entityType, entityId, documentId } = req.params;

    if (entityType === 'guarantor') {
      await Guarantor.findByIdAndUpdate(
        entityId,
        { $pull: { documents: { _id: documentId } } }
      );
    }

    res.json({
      success: true,
      message: 'Fayl o\'chirildi'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;