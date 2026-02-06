const express = require('express');
const router = express.Router();
const contractGenerator = require('../services/contractGenerator');
const { protect } = require('../middleware/auth');

// Mijoz shartnomasi yaratish
router.post('/generate-customer/:customerId', protect, async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await contractGenerator.generateCustomerContract(customerId);
    
    // DOCX faylni yuborish
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Length', result.buffer.length);
    
    res.send(result.buffer);
    
  } catch (error) {
    console.error('Mijoz shartnomasi yaratishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Shartnoma yaratishda xatolik',
      error: error.message
    });
  }
});

// Kafil shartnomasi yaratish
router.post('/generate-guarantor/:customerId', protect, async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const result = await contractGenerator.generateGuarantorContract(customerId);
    
    // DOCX faylni yuborish
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Length', result.buffer.length);
    
    res.send(result.buffer);
    
  } catch (error) {
    console.error('Kafil shartnomasi yaratishda xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Kafil shartnomasi yaratishda xatolik',
      error: error.message
    });
  }
});

// Shartnoma template'ini ko'rish (debug uchun)
router.get('/template-preview/:customerId', protect, async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // Bu faqat development uchun - template qanday ko'rinishini ko'rish
    const Customer = require('../models/Customer');
    const customer = await Customer.findById(customerId)
      .populate('product')
      .populate('guarantor');

    if (!customer) {
      return res.status(404).json({ message: 'Mijoz topilmadi' });
    }

    const data = contractGenerator.prepareCustomerData(customer);
    
    res.json({
      success: true,
      customer: customer.fullName,
      templateData: data
    });
    
  } catch (error) {
    console.error('Template preview xatolik:', error);
    res.status(500).json({
      success: false,
      message: 'Template ko\'rishda xatolik',
      error: error.message
    });
  }
});

module.exports = router;