const axios = require('axios');
const notificationService = require('./notificationService');

class TelegramPolling {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.isPolling = false;
    this.offset = 0;
    this.pollInterval = null;
  }

  // Polling boshlash
  startPolling() {
    if (this.isPolling || !this.token) {
      return;
    }

    // Avval webhook'ni o'chirish
    this.removeWebhook().then(() => {
      this.isPolling = true;
      console.log('Telegram polling started...');
      
      this.pollInterval = setInterval(() => {
        this.getUpdates();
      }, 2000); // Har 2 sekundda tekshirish
    });
  }

  // Webhook o'chirish
  async removeWebhook() {
    try {
      await axios.post(`https://api.telegram.org/bot${this.token}/deleteWebhook`);
      console.log('Webhook removed for polling');
    } catch (error) {
      console.log('Remove webhook error:', error.message);
    }
  }

  // Polling to'xtatish
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
    console.log('Telegram polling stopped.');
  }

  // Yangilanishlarni olish
  async getUpdates() {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${this.token}/getUpdates`, {
        params: {
          offset: this.offset,
          timeout: 10
        }
      });

      if (response.data.ok && response.data.result.length > 0) {
        for (const update of response.data.result) {
          await this.processUpdate(update);
          this.offset = update.update_id + 1;
        }
      }
    } catch (error) {
      // 409 xatolikni ignore qilamiz (conflict with webhook)
      if (error.response && error.response.status === 409) {
        console.log('Webhook conflict detected, continuing polling...');
      } else {
        console.error('Polling error:', error.message);
      }
    }
  }

  // Yangilanishni qayta ishlash
  async processUpdate(update) {
    try {
      if (update.message && update.message.text) {
        const chatId = update.message.chat.id;
        const messageText = update.message.text;
        const firstName = update.message.from.first_name || 'Foydalanuvchi';
        
        console.log(`Received message from ${firstName} (${chatId}): ${messageText}`);
        
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
    } catch (error) {
      console.error('Process update error:', error);
    }
  }
}

module.exports = new TelegramPolling();