const express = require('express');
const Payment = require('../models/Payment');
const Contract = require('../models/Contract');
const { protect, authorize, auditLog } = require('../middleware/auth');

const router = express.Router();

// @desc    Yangi to'lov qabul qilish
// @route   POST /api/payments
// @access  Private
router.post('/', protect, auditLog('create', 'payment'), async (req, res) => {
  try {
    const paymentData = {
      ...req.body,
      receivedBy: req.user._id
    };

    const payment = await Payment.create(paymentData);
    
    // Shartnomadagi to'lov jadvalini yangilash
    const contract = await Contract.findById(payment.contract);
    if (contract && payment.installmentNumber) {
      const installment = contract.paymentSchedule.find(
        p => p.installmentNumber === payment.installmentNumber
      );
      
      if (installment) {
        installment.paidAmount += payment.amount;
        installment.paidDate = payment.paymentDate;
        
        if (installment.paidAmount >= installment.totalAmount) {
          installment.status = 'paid';
        }
        
        await contract.save();
      }
    }
    
    await payment.populate(['contract', 'receivedBy']);

    res.status(201).json({
      success: true,
      message: 'To\'lov muvaffaqiyatli qabul qilindi',
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Barcha to'lovlar ro'yxati
// @route   GET /api/payments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      contract,
      paymentMethod,
      paymentType,
      startDate,
      endDate
    } = req.query;
    
    const query = {};
    
    if (contract) {
      query.contract = contract;
    }
    
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    
    if (paymentType) {
      query.paymentType = paymentType;
    }
    
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) {
        query.paymentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.paymentDate.$lte = new Date(endDate);
      }
    }

    const payments = await Payment.find(query)
      .populate('contract', 'contractNumber customer')
      .populate('receivedBy', 'fullName')
      .sort({ paymentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
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

// @desc    To'lov ma'lumotlarini olish
// @route   GET /api/payments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('contract')
      .populate('receivedBy', 'fullName');

    if (!payment) {
      return res.status(404).json({ 
        message: 'To\'lov topilmadi' 
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Shartnoma bo'yicha to'lovlar
// @route   GET /api/payments/contract/:contractId
// @access  Private
router.get('/contract/:contractId', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ 
      contract: req.params.contractId 
    })
    .populate('receivedBy', 'fullName')
    .sort({ paymentDate: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;