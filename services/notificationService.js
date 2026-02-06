const axios = require('axios');
const Notification = require('../models/Notification');
const Contract = require('../models/Contract');
const Guarantor = require('../models/Guarantor');

class NotificationService {
  constructor() {
    this.smsApiUrl = process.env.SMS_API_URL;
    this.smsToken = process.env.SMS_API_TOKEN;
    this.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    this.telegramChatId = process.env.TELEGRAM_CHAT_ID;
  }

  /**
   * SMS yuborish
   */
  async sendSMS(phone, message) {
    try {
      if (!this.smsApiUrl || !this.smsToken) {
        console.log('SMS API sozlanmagan');
        return { success: false, error: 'SMS API sozlanmagan' };
      }

      const response = await axios.post(this.smsApiUrl, {
        phone: phone,
        message: message
      }, {
        headers: {
          'Authorization': `Bearer ${this.smsToken}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('SMS yuborishda xatolik:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Telegram xabar yuborish
   */
  async sendTelegram(chatId, message) {
    try {
      if (!this.telegramBotToken) {
        console.log('Telegram bot token sozlanmagan');
        return { success: false, error: 'Telegram bot token sozlanmagan' };
      }

      const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
      
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Telegram xabar yuborishda xatolik:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Bildirishnoma yaratish
   */
  async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      return { success: true, notification };
    } catch (error) {
      console.error('Bildirishnoma yaratishda xatolik:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Kunlik hisobot yuborish
   */
  async sendDailyReport() {
    try {
      const today = new Date();
      const todayStr = today.toLocaleDateString('uz-UZ');
      
      const activeContracts = await Contract.countDocuments({ status: 'active' });
      const completedContracts = await Contract.countDocuments({ status: 'completed' });
      
      const message = `
📊 <b>Kunlik hisobot - ${todayStr}</b>

📋 Faol shartnomalar: ${activeContracts}
✅ Tugallangan shartnomalar: ${completedContracts}

🏢 Ozoda Mebel CRM tizimi
      `;

      const result = await this.sendTelegram(this.telegramChatId, message);
      
      if (result.success) {
        console.log('✅ Kunlik hisobot yuborildi');
      } else {
        console.error('❌ Kunlik hisobot yuborishda xatolik:', result.error);
      }

      return result;
    } catch (error) {
      console.error('Kunlik hisobot yaratishda xatolik:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new NotificationService();