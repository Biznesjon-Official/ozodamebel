const express = require('express');
const axios = require('axios');
const notificationService = require('../services/notificationService');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Barcha xabarlarni olish
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('contract')
      .sort({ createdDate: -1 })
      .limit(100);
    
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Yangi xabar yaratish
router.post('/', protect, async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    
    res.status(201).json({ notification });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Xabar yuborish
router.post('/:id/send', protect, async (req, res) => {
  try {
    const result = await notificationService.sendNotification(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bugun to'lov kuni bo'lganlarni tekshirish va Telegram xabar yuborish
router.post('/check-today', protect, async (req, res) => {
  try {
    const result = await notificationService.checkAndSendTodayPayments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2 kun qolgan to'lovlarni tekshirish va Telegram xabar yuborish
router.post('/check-upcoming', protect, async (req, res) => {
  try {
    const result = await notificationService.checkAndSendUpcomingPayments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Kunlik hisobot yuborish
router.post('/daily-report', protect, async (req, res) => {
  try {
    const result = await notificationService.sendDailyPaymentReport();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test Telegram xabar yuborish
router.post('/test-telegram', protect, async (req, res) => {
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

// Manual test - 2 kun qolgan to'lovlarni tekshirish
router.post('/test-upcoming', async (req, res) => {
  try {
    const result = await notificationService.checkAndSendUpcomingPayments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manual test - bugun to'lov kuni bo'lganlarni tekshirish
router.post('/test-today', async (req, res) => {
  try {
    const result = await notificationService.checkAndSendTodayPayments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bot ishga tushirish va test xabar yuborish
router.post('/start-bot', async (req, res) => {
  try {
    // Agar chat ID yo'q bo'lsa, faqat bot tokenini tekshiramiz
    if (!notificationService.telegramBotToken) {
      return res.status(500).json({ 
        success: false, 
        message: 'Telegram bot token konfiguratsiya qilinmagan',
        error: 'TELEGRAM_BOT_TOKEN environment variable not set' 
      });
    }
    
    // Bot ma'lumotlarini olish (token tekshirish uchun)
    const botInfoResponse = await axios.get(`https://api.telegram.org/bot${notificationService.telegramBotToken}/getMe`);
    
    if (!botInfoResponse.data.ok) {
      return res.status(500).json({ 
        success: false, 
        message: 'Telegram bot token noto\'g\'ri',
        error: 'Invalid bot token' 
      });
    }
    
    const botInfo = botInfoResponse.data.result;
    
    // Bot buyruqlarini o'rnatish
    const commands = [
      { command: 'start', description: 'Botni ishga tushirish' },
      { command: 'help', description: 'Yordam' },
      { command: 'status', description: 'Bot holati' }
    ];
    
    try {
      await axios.post(`https://api.telegram.org/bot${notificationService.telegramBotToken}/setMyCommands`, {
        commands: commands
      });
    } catch (cmdError) {
      console.log('Commands set error:', cmdError.message);
    }
    
    // Oxirgi xabarlarni olish (chat ID topish uchun)
    let chatId = notificationService.telegramChatId;
    let foundNewChat = false;
    
    try {
      const updatesResponse = await axios.get(`https://api.telegram.org/bot${notificationService.telegramBotToken}/getUpdates`);
      if (updatesResponse.data.ok && updatesResponse.data.result.length > 0) {
        // Eng oxirgi xabardan chat ID ni olish
        const lastUpdate = updatesResponse.data.result[updatesResponse.data.result.length - 1];
        if (lastUpdate.message && lastUpdate.message.chat) {
          chatId = lastUpdate.message.chat.id;
          foundNewChat = true;
          console.log('Auto-detected chat ID:', chatId);
        }
      }
    } catch (updatesError) {
      console.log('Get updates error:', updatesError.message);
    }
    
    // Agar chat ID yo'q bo'lsa, avtomatik /start xabar yuborish
    if (!chatId || chatId === '@your_channel_username' || chatId === 'YOUR_CHAT_ID_HERE') {
      // Webhook o'rnatish (agar BASE_URL mavjud bo'lsa)
      if (process.env.BASE_URL) {
        try {
          const webhookUrl = `${process.env.BASE_URL}/api/telegram/webhook`;
          await axios.post(`https://api.telegram.org/bot${notificationService.telegramBotToken}/setWebhook`, {
            url: webhookUrl
          });
          console.log('Webhook set to:', webhookUrl);
        } catch (webhookError) {
          console.log('Webhook set error:', webhookError.message);
        }
      }
      
      return res.json({ 
        success: true, 
        message: 'Bot token to\'g\'ri va buyruqlar o\'rnatildi',
        botInfo: botInfo,
        instructions: `Telegram'da @${botInfo.username} botiga o'ting va /start buyrug'ini yuboring, keyin bu tugmani qayta bosing`,
        botUsername: botInfo.username,
        autoStartUrl: `https://t.me/${botInfo.username}?start=ozoda_mebel_crm`,
        webhookSet: !!process.env.BASE_URL
      });
    }
    
    const startMessage = `🤖 <b>Ozoda Mebel Bot Ishga Tushdi!</b>

✅ Bot muvaffaqiyatli ishga tushirildi
📅 Bugungi sana: ${new Date().toLocaleDateString('uz-UZ')}
⏰ Vaqt: ${new Date().toLocaleTimeString('uz-UZ')}

🔔 <b>Avtomatik xabarnomalar:</b>
• To'lovdan 2 kun oldin ogohlantirish
• To'lov kuni eslatma

📞 <b>Aloqa:</b>
Ozoda Mebel - Mebel va maishiy texnika muddatli to'lov`;

    const result = await notificationService.sendTelegram(chatId, startMessage);
    
    if (result.success) {
      // Chat ID ni .env fayliga yozish uchun taklif qilish
      res.json({ 
        success: true, 
        message: 'Bot muvaffaqiyatli ishga tushirildi va test xabar yuborildi',
        telegramResult: result
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Bot ishga tushirishda xatolik yuz berdi',
        error: result.error
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server xatoligi',
      error: error.message 
    });
  }
});

// Kechikkan to'lovlarni olish
router.get('/overdue-payments', protect, async (req, res) => {
  try {
    const result = await notificationService.checkAndSendOverduePayments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;