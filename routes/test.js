const express = require('express');
const notificationService = require('../services/notificationService');
const Contract = require('../models/Contract');

const router = express.Router();

// Test - 2 kun qolgan to'lovlarni tekshirish
router.get('/upcoming-payments', async (req, res) => {
  try {
    const result = await notificationService.checkAndSendUpcomingPayments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test - kunlik hisobot
router.get('/daily-report', async (req, res) => {
  try {
    const result = await notificationService.sendDailyPaymentReport();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test - Telegram xabar yuborish
router.post('/telegram', async (req, res) => {
  try {
    const { message } = req.body;
    const result = await notificationService.sendTelegram(
      notificationService.telegramChatId,
      message || '🧪 Test xabar - Ozoda Mebel CRM tizimi'
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test - barcha faol shartnomalarni ko'rish
router.get('/contracts', async (req, res) => {
  try {
    const contracts = await Contract.find({ status: 'active' })
      .populate('guarantor', 'fullName contact')
      .select('contractNumber guarantor product financial startDate')
      .limit(10);

    const contractsWithInfo = contracts.map(contract => {
      return {
        contractNumber: contract.contractNumber,
        guarantor: contract.guarantor?.fullName,
        phone: contract.guarantor?.contact?.primaryPhone,
        product: contract.product?.name
      };
    });

    res.json({
      success: true,
      count: contracts.length,
      contracts: contractsWithInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test - yangi PDF format yaratish
router.get('/generate-new-pdf/:contractId', async (req, res) => {
  try {
    const { contractId } = req.params;
    
    const contract = await Contract.findById(contractId)
      .populate('guarantor')
      .populate('createdBy', 'fullName');

    if (!contract) {
      return res.status(404).json({ 
        message: 'Shartnoma topilmadi' 
      });
    }

    // PDF generatsiya qilish
    const PDFGenerator = require('../utils/pdfGenerator');
    const pdfGenerator = new PDFGenerator();
    
    const contractPdf = await pdfGenerator.generateContract(contract);
    const guarantorPdf = await pdfGenerator.generateGuarantorAgreement(contract);
    const schedulePdf = await pdfGenerator.generatePaymentSchedule(contract);
    
    res.json({
      success: true,
      message: 'Yangi format PDF yaratildi',
      files: {
        contract: contractPdf,
        guarantor: guarantorPdf,
        schedule: schedulePdf
      }
    });
  } catch (error) {
    console.error('PDF generatsiya xatoligi:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;