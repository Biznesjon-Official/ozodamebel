const express = require('express');
const Customer = require('../models/Customer');
const { protect, authorize, auditLog } = require('../middleware/auth');

const router = express.Router();

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

// @desc    Yangi mijoz yaratish
// @route   POST /api/customers
// @access  Private
router.post('/', protect, auditLog('create', 'customer'), async (req, res) => {
  try {
    const {
      // Customer info
      fullName,
      phone,
      birthDate,
      region,
      district,
      address,
      houseNumber,
      passportSeries,
      profileImages,
      
      // Guarantor info
      guarantorName,
      guarantorPhone,
      guarantorBirthDate,
      guarantorRegion,
      guarantorDistrict,
      guarantorAddress,
      guarantorHouseNumber,
      guarantorPassport,
      
      // Product info
      productName,
      originalPrice,
      profitPercentage,
      markupAmount,
      markupType,
      sellingPrice,
      installmentMonths,
      monthlyPayment,
      
      // Initial payment
      initialPayment,
      nextPaymentDate
    } = req.body;

    // Telefon raqamlarni normalize qilish
    const normalizedPhone = normalizePhone(phone);
    const normalizedGuarantorPhone = guarantorPhone ? normalizePhone(guarantorPhone) : null;

    // Mijoz ma'lumotlarini yaratish
    const customerData = {
      fullName,
      phone: normalizedPhone,
      birthDate,
      region,
      district,
      address,
      houseNumber,
      passportSeries,
      profileImages,
      
      product: {
        name: productName,
        originalPrice: parseFloat(originalPrice),
        profitPercentage: parseFloat(profitPercentage || 0),
        markupAmount: parseFloat(markupAmount || 0),
        markupType: markupType || 'percent',
        sellingPrice: parseFloat(sellingPrice),
        installmentMonths: parseInt(installmentMonths),
        monthlyPayment: parseFloat(monthlyPayment)
      },
      
      creditInfo: {
        startDate: new Date(),
        initialPayment: parseFloat(initialPayment) || 0,
        remainingAmount: parseFloat(sellingPrice) - (parseFloat(initialPayment) || 0),
        nextPaymentDate: nextPaymentDate ? new Date(nextPaymentDate) : null
      },
      
      createdBy: req.user._id
    };
    
    // Add guarantor info only if provided
    if (guarantorName && normalizedGuarantorPhone) {
      customerData.guarantor = {
        name: guarantorName,
        phone: normalizedGuarantorPhone,
        birthDate: guarantorBirthDate,
        region: guarantorRegion,
        district: guarantorDistrict,
        address: guarantorAddress,
        houseNumber: guarantorHouseNumber,
        passportSeries: guarantorPassport
      };
    }

    const customer = await Customer.create(customerData);
    
    await customer.populate('createdBy', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Mijoz muvaffaqiyatli yaratildi',
      customer
    });
  } catch (error) {
    console.error('Customer creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Bunday ma\'lumotlar bilan mijoz allaqachon mavjud' 
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Ma\'lumotlar validatsiyadan o\'tmadi',
        errors
      });
    }
    res.status(500).json({ message: error.message });
  }
});

// @desc    1 kun kechikkan mijozlar
// @route   GET /api/customers/overdue-1-day
// @access  Private
router.get('/overdue-1-day', protect, async (req, res) => {
  try {
    const today = new Date();
    const oneDayAgo = new Date(today.getTime() - (1 * 24 * 60 * 60 * 1000));
    const startOfOneDayAgo = new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate());
    const endOfOneDayAgo = new Date(oneDayAgo.getFullYear(), oneDayAgo.getMonth(), oneDayAgo.getDate() + 1);

    const customers = await Customer.find({
      'creditInfo.nextPaymentDate': {
        $gte: startOfOneDayAgo,
        $lt: endOfOneDayAgo
      },
      status: 'active'
    }).populate('createdBy', 'fullName').sort({ 'creditInfo.nextPaymentDate': 1 });

    res.json({
      success: true,
      customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Get 1 day overdue customers error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    3 kun kechikkan mijozlar
// @route   GET /api/customers/overdue-3-days
// @access  Private
router.get('/overdue-3-days', protect, async (req, res) => {
  try {
    const today = new Date();
    const threeDaysAgo = new Date(today.getTime() - (3 * 24 * 60 * 60 * 1000));
    
    const customers = await Customer.find({
      'creditInfo.nextPaymentDate': {
        $lt: threeDaysAgo
      },
      status: 'active'
    }).populate('createdBy', 'fullName').sort({ 'creditInfo.nextPaymentDate': 1 });

    res.json({
      success: true,
      customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Get 3+ days overdue customers error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Bugun to'lov qilishi kerak bo'lgan mijozlar
// @route   GET /api/customers/due-today
// @access  Private
router.get('/due-today', protect, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const customers = await Customer.find({
      'creditInfo.nextPaymentDate': {
        $gte: startOfDay,
        $lt: endOfDay
      },
      status: 'active'
    }).populate('createdBy', 'fullName').sort({ 'creditInfo.nextPaymentDate': 1 });

    res.json({
      success: true,
      customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Get due today customers error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    2 kun ichida to'lov qilishi kerak bo'lgan mijozlar
// @route   GET /api/customers/due-soon
// @access  Private
router.get('/due-soon', protect, async (req, res) => {
  try {
    const today = new Date();
    const twoDaysLater = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
    const startOfTwoDays = new Date(twoDaysLater.getFullYear(), twoDaysLater.getMonth(), twoDaysLater.getDate());
    const endOfTwoDays = new Date(twoDaysLater.getFullYear(), twoDaysLater.getMonth(), twoDaysLater.getDate() + 1);

    const customers = await Customer.find({
      'creditInfo.nextPaymentDate': {
        $gte: startOfTwoDays,
        $lt: endOfTwoDays
      },
      status: 'active'
    }).populate('createdBy', 'fullName').sort({ 'creditInfo.nextPaymentDate': 1 });

    res.json({
      success: true,
      customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Get due soon customers error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Barcha mijozlar ro'yxati
// @route   GET /api/customers
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
      query.region = region;
    }
    
    if (district) {
      query.district = district;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { 'guarantor.name': { $regex: search, $options: 'i' } },
        { 'guarantor.phone': { $regex: search, $options: 'i' } },
        { 'product.name': { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Customer.countDocuments(query);

    res.json({
      success: true,
      customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mijoz ma'lumotlarini olish
// @route   GET /api/customers/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('createdBy', 'fullName');

    if (!customer) {
      return res.status(404).json({ 
        message: 'Mijoz topilmadi' 
      });
    }

    res.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mijoz ma'lumotlarini yangilash
// @route   PUT /api/customers/:id
// @access  Private
router.put('/:id', protect, auditLog('update', 'customer'), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ 
        message: 'Mijoz topilmadi' 
      });
    }

    const {
      // Customer info
      fullName,
      phone,
      birthDate,
      region,
      district,
      address,
      houseNumber,
      passportSeries,
      profileImages,
      
      // Guarantor info
      guarantorName,
      guarantorPhone,
      guarantorBirthDate,
      guarantorRegion,
      guarantorDistrict,
      guarantorAddress,
      guarantorHouseNumber,
      guarantorPassport,
      
      // Product info
      productName,
      originalPrice,
      profitPercentage,
      markupAmount,
      markupType,
      sellingPrice,
      installmentMonths,
      monthlyPayment,
      initialPayment
    } = req.body;

    // Telefon raqamlarni normalize qilish
    const normalizedPhone = phone ? normalizePhone(phone) : customer.phone;
    const normalizedGuarantorPhone = guarantorPhone ? normalizePhone(guarantorPhone) : customer.guarantor?.phone;

    // Update customer data
    const updateData = {
      fullName: fullName || customer.fullName,
      phone: normalizedPhone,
      birthDate: birthDate || customer.birthDate,
      region: region || customer.region,
      district: district || customer.district,
      address: address || customer.address,
      houseNumber: houseNumber || customer.houseNumber,
      passportSeries: passportSeries || customer.passportSeries,
      profileImages: profileImages || customer.profileImages,
      
      guarantor: {
        name: guarantorName || customer.guarantor?.name,
        phone: normalizedGuarantorPhone,
        birthDate: guarantorBirthDate || customer.guarantor?.birthDate,
        region: guarantorRegion || customer.guarantor?.region,
        district: guarantorDistrict || customer.guarantor?.district,
        address: guarantorAddress || customer.guarantor?.address,
        houseNumber: guarantorHouseNumber || customer.guarantor?.houseNumber,
        passportSeries: guarantorPassport || customer.guarantor?.passportSeries
      },
      
      product: {
        name: productName || customer.product?.name,
        originalPrice: originalPrice ? parseFloat(originalPrice) : customer.product?.originalPrice,
        profitPercentage: profitPercentage !== undefined ? parseFloat(profitPercentage) : customer.product?.profitPercentage,
        markupAmount: markupAmount !== undefined ? parseFloat(markupAmount) : customer.product?.markupAmount,
        markupType: markupType || customer.product?.markupType,
        sellingPrice: sellingPrice ? parseFloat(sellingPrice) : customer.product?.sellingPrice,
        installmentMonths: installmentMonths ? parseInt(installmentMonths) : customer.product?.installmentMonths,
        monthlyPayment: monthlyPayment ? parseFloat(monthlyPayment) : customer.product?.monthlyPayment
      }
    };

    // Update initial payment if provided
    if (initialPayment !== undefined) {
      updateData['creditInfo.initialPayment'] = parseFloat(initialPayment) || 0;
      updateData['creditInfo.remainingAmount'] = updateData.product.sellingPrice - (parseFloat(initialPayment) || 0);
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName');

    res.json({
      success: true,
      message: 'Mijoz ma\'lumotlari muvaffaqiyatli yangilandi',
      customer: updatedCustomer
    });
  } catch (error) {
    console.error('Customer update error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Bunday ma\'lumotlar bilan mijoz allaqachon mavjud' 
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        message: 'Ma\'lumotlar validatsiyadan o\'tmadi',
        errors
      });
    }
    res.status(500).json({ message: error.message });
  }
});

// @desc    Keyingi to'lov sanasini yangilash
// @route   PUT /api/customers/:id/next-payment
// @access  Private
router.put('/:id/next-payment', protect, auditLog('update', 'customer'), async (req, res) => {
  try {
    const { nextPaymentDate } = req.body;
    
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ 
        message: 'Mijoz topilmadi' 
      });
    }

    customer.creditInfo.nextPaymentDate = new Date(nextPaymentDate);
    await customer.save();

    res.json({
      success: true,
      message: 'Keyingi to\'lov sanasi yangilandi',
      customer
    });
  } catch (error) {
    console.error('Next payment date update error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mijoz to'lov qilish
// @route   POST /api/customers/:id/payment
// @access  Private
router.post('/:id/payment', protect, auditLog('create', 'payment'), async (req, res) => {
  try {
    const { amount, method, notes } = req.body;
    const customerId = req.params.id;
    
    // Mijozni topish
    const customer = await Customer.findById(customerId).populate('product');
    
    if (!customer) {
      return res.status(404).json({ message: 'Mijoz topilmadi' });
    }

    // To'lov miqdorini tekshirish
    const paymentAmount = parseFloat(amount);
    const remainingAmount = customer.creditInfo?.remainingAmount || 0;
    
    if (paymentAmount <= 0) {
      return res.status(400).json({ message: 'To\'lov miqdori 0 dan katta bo\'lishi kerak' });
    }
    
    if (paymentAmount > remainingAmount) {
      return res.status(400).json({ message: 'To\'lov miqdori qolgan summadan ko\'p bo\'lishi mumkin emas' });
    }

    // Yangi qolgan summani hisoblash
    const newRemainingAmount = remainingAmount - paymentAmount;
    
    // To'langan oylar sonini yangilash
    const currentPaidMonths = customer.creditInfo?.paidMonths || 0;
    const newPaidMonths = currentPaidMonths + 1;
    
    // Qolgan oylar sonini hisoblash
    const totalMonths = customer.product?.installmentMonths || 12;
    const remainingMonths = Math.max(0, totalMonths - newPaidMonths);
    
    // Yangi oylik to'lovni hisoblash (agar qolgan oylar bo'lsa)
    let newMonthlyPayment = customer.product?.monthlyPayment || 0;
    if (remainingMonths > 0 && newRemainingAmount > 0) {
      newMonthlyPayment = Math.ceil(newRemainingAmount / remainingMonths);
    } else if (newRemainingAmount <= 0) {
      newMonthlyPayment = 0;
    }
    
    // Keyingi to'lov sanasini hisoblash (1 oy qo'shish)
    const currentDate = new Date();
    const nextPaymentDate = new Date(currentDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    // Mijoz ma'lumotlarini yangilash
    customer.creditInfo.remainingAmount = newRemainingAmount;
    customer.creditInfo.paidMonths = newPaidMonths;
    customer.creditInfo.totalPaid = (customer.creditInfo.totalPaid || 0) + paymentAmount;
    customer.product.monthlyPayment = newMonthlyPayment;
    
    // Keyingi to'lov sanasini o'rnatish
    if (newRemainingAmount > 0) {
      customer.creditInfo.nextPaymentDate = nextPaymentDate;
    } else {
      // To'lov tugallangan
      customer.status = 'completed';
      customer.creditInfo.nextPaymentDate = null;
    }
    
    await customer.save();

    // To'lov yozuvini yaratish (agar Payment model ishlatilsa)
    const Payment = require('../models/Payment');
    
    // Contract topish yoki yaratish (soddalashtirilgan)
    let contract = null;
    try {
      const Contract = require('../models/Contract');
      contract = await Contract.findOne({ customer: customerId });
    } catch (error) {
      console.log('Contract model topilmadi, to\'lov faqat mijoz ma\'lumotlarida saqlanadi');
    }

    // To'lov yozuvini yaratish
    if (contract) {
      const payment = new Payment({
        contract: contract._id,
        amount: paymentAmount,
        paymentMethod: method || 'cash',
        paymentType: 'installment',
        receivedBy: req.user._id,
        notes: notes || `Mijoz to'lovi: ${customer.fullName}`
      });
      
      await payment.save();
    }

    res.json({
      success: true,
      message: 'To\'lov muvaffaqiyatli qabul qilindi',
      customer: await Customer.findById(customerId).populate('product').populate('guarantor'),
      payment: {
        amount: paymentAmount,
        method: method || 'cash',
        date: new Date(),
        remainingAmount: newRemainingAmount,
        newMonthlyPayment: newMonthlyPayment,
        paidMonths: newPaidMonths,
        remainingMonths: remainingMonths
      }
    });

  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mijozni o'chirish
// @route   DELETE /api/customers/:id
// @access  Private (admin only)
router.delete('/:id', protect, authorize('admin'), auditLog('delete', 'customer'), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ 
        message: 'Mijoz topilmadi' 
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Mijoz muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    console.error('Customer delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;