const express = require('express');
const router = express.Router();
const telegramBot = require('../services/telegramBot');

// Bot ma'lumotlarini olish
router.get('/bot-info', async (req, res) => {
  try {
    const botInfo = await telegramBot.getBotInfo();
    res.json({
      success: true,
      botInfo,
      botUsername: botInfo.username,
      telegramUrl: `https://t.me/${botInfo.username}?start=login`
    });
  } catch (error) {
    console.error('Bot ma\'lumotlarini olishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Bot ma\'lumotlarini olishda xatolik',
      error: error.message
    });
  }
});

// Test xabar yuborish
router.post('/test', async (req, res) => {
  try {
    await telegramBot.sendTestMessage();
    res.json({
      success: true,
      message: 'Test xabar yuborildi'
    });
  } catch (error) {
    console.error('Test xabar yuborishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Test xabar yuborishda xatolik',
      error: error.message
    });
  }
});

// To'lov eslatmalarini darhol yuborish
router.post('/send-reminders', async (req, res) => {
  try {
    await telegramBot.sendPaymentReminders();
    res.json({
      success: true,
      message: 'To\'lov eslatmalari yuborildi'
    });
  } catch (error) {
    console.error('Eslatmalarni yuborishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Eslatmalarni yuborishda xatolik',
      error: error.message
    });
  }
});

// Kechikkan to'lovlarni tekshirish
router.post('/check-overdue', async (req, res) => {
  try {
    const overdue1Day = await telegramBot.getOverduePayments1Day();
    const overdue3Days = await telegramBot.getOverduePayments3Days();
    
    console.log(`🚨 1 kun kechikkan: ${overdue1Day.length} ta mijoz`);
    console.log(`🚨 3 kun kechikkan: ${overdue3Days.length} ta mijoz`);
    
    // Xabarlarni yuborish
    for (const customer of overdue1Day) {
      const message = telegramBot.formatOverduePaymentMessage(customer, 1);
      await telegramBot.sendMessage(message);
      console.log(`✅ ${customer.fullName} uchun 1 kun kechikkan xabari yuborildi`);
    }
    
    for (const customer of overdue3Days) {
      const message = telegramBot.formatOverduePaymentMessage(customer, 3);
      await telegramBot.sendMessage(message);
      console.log(`✅ ${customer.fullName} uchun 3 kun kechikkan xabari yuborildi`);
    }
    
    res.json({
      success: true,
      message: 'Kechikkan to\'lovlar tekshirildi va xabarlar yuborildi',
      data: {
        overdue1Day: overdue1Day.length,
        overdue3Days: overdue3Days.length
      }
    });
  } catch (error) {
    console.error('Kechikkan to\'lovlarni tekshirishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Kechikkan to\'lovlarni tekshirishda xatolik',
      error: error.message
    });
  }
});

// Bot holatini tekshirish
router.get('/status', async (req, res) => {
  try {
    const todayPayments = await telegramBot.getTodayPayments();
    const upcomingPayments = await telegramBot.getUpcomingPayments();
    const overdue1Day = await telegramBot.getOverduePayments1Day();
    const overdue3Days = await telegramBot.getOverduePayments3Days();
    
    res.json({
      success: true,
      data: {
        todayPayments: todayPayments.length,
        upcomingPayments: upcomingPayments.length,
        overdue1Day: overdue1Day.length,
        overdue3Days: overdue3Days.length,
        botToken: telegramBot.botToken ? 'SET' : 'NOT SET',
        lastCheck: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Bot holatini tekshirishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Bot holatini tekshirishda xatolik',
      error: error.message
    });
  }
});

// Barcha kechikkan to'lovlarni tekshirish
router.get('/overdue-all', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const customers = await telegramBot.constructor.prototype.constructor.prototype.constructor.call({}, 'Customer').find({
      'creditInfo.nextPaymentDate': {
        $lt: today
      }
    }).populate('product').populate('guarantor');

    // Har bir mijoz uchun necha kun kechikkanini hisoblash
    const overdueCustomers = customers.map(customer => {
      const paymentDate = new Date(customer.creditInfo.nextPaymentDate);
      const diffTime = Date.now() - paymentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        fullName: customer.fullName,
        phone: customer.phone,
        paymentDate: customer.creditInfo.nextPaymentDate,
        daysOverdue: diffDays
      };
    });

    res.json({
      success: true,
      data: {
        total: overdueCustomers.length,
        customers: overdueCustomers
      }
    });
  } catch (error) {
    console.error('Barcha kechikkan to\'lovlarni tekshirishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Barcha kechikkan to\'lovlarni tekshirishda xatolik',
      error: error.message
    });
  }
});

module.exports = router;