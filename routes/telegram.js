const express = require('express');
const axios = require('axios');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Telegram webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    
    // Xabar mavjudligini tekshirish
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const messageText = update.message.text;
      const firstName = update.message.from.first_name || 'Foydalanuvchi';
      
      // /start buyrug'iga javob berish
      if (messageText === '/start' || messageText.startsWith('/start')) {
        const welcomeMessage = `🎉 <b>Salom, ${firstName}!</b>

✅ <b>Ozoda Mebel CRM tizimiga xush kelibsiz!</b>

🔔 <b>Siz endi quyidagi xabarlarni olasiz:</b>
• 📅 To'lov sanasidan 2 kun oldin ogohlantirish
• ⏰ To'lov kuni eslatma xabarlari

💼 <b>Ozoda Mebel</b> - Mebel va maishiy texnika muddatli to'lov

📞 <b>Aloqa:</b> +998 XX XXX-XX-XX
🏢 <b>Manzil:</b> Toshkent shahar

<i>Bu bot avtomatik xabarlar yuboradi. Javob berish shart emas.</i>`;

        await notificationService.sendTelegram(chatId, welcomeMessage);
      }
      
      // /help buyrug'iga javob berish
      else if (messageText === '/help') {
        const helpMessage = `ℹ️ <b>Yordam</b>

<b>Mavjud buyruqlar:</b>
• /start - Botni ishga tushirish
• /help - Bu yordam xabari
• /status - Bot holati

<b>Bot funksiyalari:</b>
• Avtomatik to'lov eslatmalari
• Kunlik hisobotlar
• Kechikkan to'lovlar haqida xabar

📞 <b>Texnik yordam:</b> +998 XX XXX-XX-XX`;

        await notificationService.sendTelegram(chatId, helpMessage);
      }
      
      // /status buyrug'iga javob berish
      else if (messageText === '/status') {
        const statusMessage = `📊 <b>Bot Holati</b>

✅ Bot faol ishlayapti
🕐 Oxirgi yangilanish: ${new Date().toLocaleString('uz-UZ')}
🔔 Xabarlar: Yoqilgan

<b>Xabar yuborish:</b>
• To'lovdan 2 kun oldin ogohlantirish
• To'lov kuni eslatma

💼 <b>Ozoda Mebel CRM</b>`;

        await notificationService.sendTelegram(chatId, statusMessage);
      }
      
      // Boshqa xabarlarga javob
      else {
        const defaultMessage = `🤖 <b>Avtomatik javob</b>

Salom! Men Ozoda Mebel CRM boti.

Quyidagi buyruqlardan foydalaning:
• /start - Botni qayta ishga tushirish
• /help - Yordam
• /status - Bot holati

📞 <b>Aloqa:</b> +998 XX XXX-XX-XX`;

        await notificationService.sendTelegram(chatId, defaultMessage);
      }
    }
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook o'rnatish
router.post('/set-webhook', async (req, res) => {
  try {
    const { url } = req.body;
    const webhookUrl = url || `${process.env.BASE_URL || 'https://your-domain.com'}/api/telegram/webhook`;
    
    const response = await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
      url: webhookUrl
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook ma'lumotlarini olish
router.get('/webhook-info', async (req, res) => {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;