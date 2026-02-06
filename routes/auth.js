const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { protect, authorize, auditLog } = require('../middleware/auth');

const router = express.Router();

// JWT token yaratish
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Foydalanuvchi ro'yxatdan o'tkazish
// @route   POST /api/auth/register
// @access  Private (faqat admin)
router.post('/register', protect, authorize('admin'), async (req, res) => {
  try {
    const { username, email, password, fullName, role, phone } = req.body;

    // Foydalanuvchi mavjudligini tekshirish
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ 
        message: 'Bunday foydalanuvchi allaqachon mavjud' 
      });
    }

    // Yangi foydalanuvchi yaratish
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role,
      phone,
      createdBy: req.user._id
    });

    // Audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'create',
      resourceType: 'user',
      resourceId: user._id,
      description: `Yangi foydalanuvchi yaratildi: ${user.username}`,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.status(201).json({
      success: true,
      message: 'Foydalanuvchi muvaffaqiyatli yaratildi',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Telefon raqamni normalize qilish funksiyasi
const normalizePhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
  
  // Agar 998 bilan boshlansa, o'zgartirishsiz qaytarish
  if (cleaned.startsWith('998')) return cleaned;
  
  // Agar 9 bilan boshlansa, 998 qo'shish
  if (cleaned.startsWith('9')) return '998' + cleaned;
  
  // Boshqa holatlarda 998 qo'shish
  return '998' + cleaned;
};

// @desc    Tizimga kirish
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    console.log('🔍 Login attempt:', { phone, passwordLength: password?.length });

    // Telefon raqamni normalize qilish
    const normalizedPhone = normalizePhone(phone);
    
    console.log('🔍 Normalized phone:', normalizedPhone);
    
    // Foydalanuvchini topish - to'g'ri qidiruv
    let user = await User.findOne({ 
      phone: normalizedPhone
    }).select('+password');

    console.log('🔍 Direct search result:', user ? 'FOUND' : 'NOT FOUND');

    // Agar topilmasa, boshqa variantlarni ham sinab ko'ramiz
    if (!user) {
      console.log('🔍 Trying alternative search...');
      
      user = await User.findOne({
        $or: [
          { phone: phone },
          { username: phone },
          { username: normalizedPhone },
          { phone: `+${normalizedPhone}` }
        ]
      }).select('+password');
      
      console.log('🔍 Alternative search result:', user ? 'FOUND' : 'NOT FOUND');
    }

    console.log('🔍 Found user:', user ? { 
      id: user._id, 
      username: user.username, 
      phone: user.phone,
      isActive: user.isActive 
    } : 'Not found');

    if (!user || !user.isActive) {
      console.log('❌ User not found or inactive');
      return res.status(401).json({ 
        message: 'Noto\'g\'ri telefon raqam yoki parol' 
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    
    console.log('🔍 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password incorrect');
      return res.status(401).json({ 
        message: 'Noto\'g\'ri telefon raqam yoki parol' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create audit log
    await AuditLog.create({
      user: user._id,
      action: 'login',
      resourceType: 'user',
      description: 'Tizimga kirdi',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Tizimdan chiqish
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    // Audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'logout',
      resourceType: 'user',
      description: 'Tizimdan chiqdi',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({
      success: true,
      message: 'Tizimdan muvaffaqiyatli chiqildi'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Joriy foydalanuvchi ma'lumotlari
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Parolni o'zgartirish
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Joriy parolni tekshirish
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Joriy parol noto\'g\'ri' 
      });
    }

    // Yangi parolni saqlash
    user.password = newPassword;
    await user.save();

    // Audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'password_change',
      resourceType: 'user',
      description: 'Parol o\'zgartirildi',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({
      success: true,
      message: 'Parol muvaffaqiyatli o\'zgartirildi'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Barcha foydalanuvchilar ro'yxati
// @route   GET /api/auth/users
// @access  Private (admin, auditor)
router.get('/users', protect, authorize('admin', 'auditor'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
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

// @desc    Profil ma'lumotlarini yangilash
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, phone, currentPassword, newPassword, profileImage } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Agar yangi parol berilgan bo'lsa, joriy parolni tekshirish
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ 
          message: 'Joriy parolni kiriting' 
        });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ 
          message: 'Joriy parol noto\'g\'ri' 
        });
      }

      user.password = newPassword;
    }

    // Ma'lumotlarni yangilash
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    // Audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'profile_update',
      resourceType: 'user',
      description: 'Profil ma\'lumotlari yangilandi',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({
      success: true,
      message: 'Profil muvaffaqiyatli yangilandi',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;