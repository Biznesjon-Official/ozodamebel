const express = require('express');
const Guarantor = require('../models/Guarantor');
const { protect, authorize, auditLog } = require('../middleware/auth');

const router = express.Router();

// @desc    Yangi kafil yaratish
// @route   POST /api/guarantors
// @access  Private
router.post('/', protect, auditLog('create', 'guarantor'), async (req, res) => {
  try {
    const guarantorData = {
      ...req.body,
      createdBy: req.user._id
    };

    const guarantor = await Guarantor.create(guarantorData);
    
    await guarantor.populate('createdBy', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Kafil muvaffaqiyatli yaratildi',
      guarantor
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Bunday ma\'lumotlar bilan kafil allaqachon mavjud' 
      });
    }
    res.status(500).json({ message: error.message });
  }
});

// @desc    Barcha kafillar ro'yxati
// @route   GET /api/guarantors
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status,
      region,
      district 
    } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (region) {
      query['address.region'] = region;
    }
    
    if (district) {
      query['address.district'] = district;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { 'contact.primaryPhone': { $regex: search, $options: 'i' } },
        { 'passport.series': { $regex: search, $options: 'i' } },
        { 'passport.number': { $regex: search, $options: 'i' } }
      ];
    }

    const guarantors = await Guarantor.find(query)
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Guarantor.countDocuments(query);

    res.json({
      success: true,
      guarantors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Kafil ma'lumotlarini olish
// @route   GET /api/guarantors/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const guarantor = await Guarantor.findById(req.params.id)
      .populate('createdBy', 'fullName');

    if (!guarantor) {
      return res.status(404).json({ 
        message: 'Kafil topilmadi' 
      });
    }

    res.json({
      success: true,
      guarantor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Kafil ma'lumotlarini yangilash
// @route   PUT /api/guarantors/:id
// @access  Private
router.put('/:id', protect, auditLog('update', 'guarantor'), async (req, res) => {
  try {
    const guarantor = await Guarantor.findById(req.params.id);

    if (!guarantor) {
      return res.status(404).json({ 
        message: 'Kafil topilmadi' 
      });
    }

    const updatedGuarantor = await Guarantor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName');

    res.json({
      success: true,
      message: 'Kafil ma\'lumotlari muvaffaqiyatli yangilandi',
      guarantor: updatedGuarantor
    });
  } catch (error) {
    console.error('Guarantor update error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Bunday ma\'lumotlar bilan kafil allaqachon mavjud' 
      });
    }
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      return res.status(400).json({ 
        message: 'Ma\'lumotlar validatsiyadan o\'tmadi',
        errors: error.errors
      });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;