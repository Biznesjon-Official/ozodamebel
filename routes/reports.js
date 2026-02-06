const express = require('express');
const Contract = require('../models/Contract');
const Payment = require('../models/Payment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Dashboard statistikasi
// @route   GET /api/reports/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const activeContracts = await Contract.countDocuments({ status: 'active' });
    const completedContracts = await Contract.countDocuments({ status: 'completed' });
    
    // Bugungi to'lovlar
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayPayments = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Kechikkan to'lovlar
    const overdueContracts = await Contract.countDocuments({
      status: 'active',
      'paymentSchedule.status': 'overdue'
    });
    
    // Oylik tushumlar
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: monthStart },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        activeContracts,
        completedContracts,
        todayPayments: todayPayments[0] || { count: 0, total: 0 },
        overdueContracts,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Oylik hisobot
// @route   GET /api/reports/monthly
// @access  Private
router.get('/monthly', protect, async (req, res) => {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const monthlyData = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$paymentDate' },
            method: '$paymentMethod'
          },
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Kechikkan to'lovlar hisoboti
// @route   GET /api/reports/overdue
// @access  Private
router.get('/overdue', protect, async (req, res) => {
  try {
    const overdueContracts = await Contract.find({
      status: 'active',
      'paymentSchedule.status': 'overdue'
    })
    .populate('customer', 'fullName contact')
    .populate('guarantor', 'fullName contact')
    .select('contractNumber customer guarantor paymentSchedule financial');

    const overdueData = overdueContracts.map(contract => {
      const overduePayments = contract.paymentSchedule.filter(p => p.status === 'overdue');
      const totalOverdue = overduePayments.reduce((sum, p) => sum + p.totalAmount, 0);
      const daysPast = Math.max(...overduePayments.map(p => 
        Math.ceil((new Date() - new Date(p.dueDate)) / (1000 * 60 * 60 * 24))
      ));

      return {
        contractNumber: contract.contractNumber,
        customer: contract.customer,
        guarantor: contract.guarantor,
        totalOverdue,
        daysPast,
        overdueCount: overduePayments.length
      };
    });

    res.json({
      success: true,
      data: overdueData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;