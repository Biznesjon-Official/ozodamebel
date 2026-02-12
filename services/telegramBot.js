const axios = require('axios');
const Customer = require('../models/Customer');
const { formatPhoneNumber, formatCurrency, formatDate } = require('../utils/formatters');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

class TelegramBot {
  constructor() {
    this.botToken = BOT_TOKEN;
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    this.chatId = CHAT_ID;
  }

  // Xabar yuborish funksiyasi
  async sendMessage(text, chatId = null) {
    try {
      const targetChatId = chatId || this.chatId;
      
      if (!targetChatId) {
        throw new Error('Chat ID mavjud emas');
      }

      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: targetChatId,
        text: text,
        parse_mode: 'HTML'
      });

      return response.data;
    } catch (error) {
      console.error('❌ Xabar yuborishda xatolik:', error.response?.data?.description || error.message);
      throw error;
    }
  }

  async getBotInfo() {
    try {
      const response = await axios.get(`${this.baseUrl}/getMe`);
      console.log('🤖 Bot ma\'lumotlari:', response.data.result);
      return response.data.result;
    } catch (error) {
      console.error('❌ Bot ma\'lumotlarini olishda xatolik:', error.response?.data?.description || error.message);
      throw error;
    }
  }

  // Bugun to'lov kuni bo'lgan mijozlar uchun xabar
  formatTodayPaymentMessage(customer) {
    return `📅 <b>BUGUN TO'LOV KUNI</b>

👤 <b>Mijoz:</b> ${customer.fullName}
📱 <b>Telefon:</b> ${formatPhoneNumber(customer.phone)}
🛋 <b>Mahsulot:</b> ${customer.product?.name || 'Noma\'lum'}
💰 <b>To'lov miqdori:</b> ${formatCurrency(customer.product?.monthlyPayment || 0)} so'm
📅 <b>To'lov sanasi:</b> ${formatDate(customer.creditInfo?.nextPaymentDate)}

🔔 <b>BUGUN TO'LOV KUNI!</b>
📞 Mijoz bilan bog'lanib, to'lovni eslatib qo'ying.`;
  }

  // 2 kun qolgan mijozlar uchun xabar
  formatUpcomingPaymentMessage(customer) {
    return `🔔 <b>TO'LOV ESLATMASI</b>

👤 <b>Mijoz:</b> ${customer.fullName}
📱 <b>Telefon:</b> ${formatPhoneNumber(customer.phone)}
🛋 <b>Mahsulot:</b> ${customer.product?.name || 'Noma\'lum'}
💰 <b>To'lov miqdori:</b> ${formatCurrency(customer.product?.monthlyPayment || 0)} so'm
📅 <b>To'lov sanasi:</b> ${formatDate(customer.creditInfo?.nextPaymentDate)}

⏰ <b>Oylik to'lov sanasiga atigi 2 kun qoldi!</b>
📞 Mijoz bilan bog'lanib, eslatib qo'ying.`;
  }

  // Bugun to'lov kuni bo'lgan mijozlarni topish
  async getTodayPayments() {
    try {
      // Check if MongoDB is connected
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        console.warn('⚠️ MongoDB ulanmagan, so\'rovni o\'tkazib yuborish');
        return [];
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const customers = await Customer.find({
        'creditInfo.nextPaymentDate': {
          $gte: today,
          $lt: tomorrow
        }
      })
      .populate('product')
      .populate('guarantor')
      .maxTimeMS(20000); // 20 second timeout for query

      return customers;
    } catch (error) {
      console.error('❌ Bugungi to\'lovlarni olishda xatolik:', error.message);
      return [];
    }
  }

  // Kechikkan to'lovlar uchun xabar formati
  formatOverduePaymentMessage(customer, daysOverdue) {
    return `🚨 <b>KECHIKKAN TO'LOV!</b>

👤 <b>Mijoz:</b> ${customer.fullName}
📱 <b>Telefon:</b> ${formatPhoneNumber(customer.phone)}
🛋 <b>Mahsulot:</b> ${customer.product?.name || 'Noma\'lum'}
💰 <b>To'lov miqdori:</b> ${formatCurrency(customer.product?.monthlyPayment || 0)} so'm
📅 <b>To'lov sanasi:</b> ${formatDate(customer.creditInfo?.nextPaymentDate)}

⚠️ <b>${daysOverdue} kun kechikdi!</b>
📞 Zudlik bilan mijoz bilan bog'lanib, to'lovni talab qiling!`;
  }

  // 2 kun qolgan to'lovlarni topish
  async getUpcomingPayments() {
    try {
      // Check if MongoDB is connected
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        console.warn('⚠️ MongoDB ulanmagan, so\'rovni o\'tkazib yuborish');
        return [];
      }

      const twoDaysLater = new Date();
      twoDaysLater.setDate(twoDaysLater.getDate() + 2);
      twoDaysLater.setHours(0, 0, 0, 0);
      
      const threeDaysLater = new Date(twoDaysLater);
      threeDaysLater.setDate(threeDaysLater.getDate() + 1);

      const customers = await Customer.find({
        'creditInfo.nextPaymentDate': {
          $gte: twoDaysLater,
          $lt: threeDaysLater
        }
      })
      .populate('product')
      .populate('guarantor')
      .maxTimeMS(20000); // 20 second timeout for query

      return customers;
    } catch (error) {
      console.error('❌ Yaqinlashayotgan to\'lovlarni olishda xatolik:', error.message);
      return [];
    }
  }

  // Kechikkan to'lovlarni topish (1 kun)
  async getOverduePayments1Day() {
    try {
      // Check if MongoDB is connected
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        console.warn('⚠️ MongoDB ulanmagan, so\'rovni o\'tkazib yuborish');
        return [];
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);

      const customers = await Customer.find({
        'creditInfo.nextPaymentDate': {
          $lt: yesterday
        }
      })
      .populate('product')
      .populate('guarantor')
      .maxTimeMS(20000); // 20 second timeout for query

      // Faqat 1 kun kechikkanlarni filter qilish
      const oneDayOverdue = customers.filter(customer => {
        const paymentDate = new Date(customer.creditInfo.nextPaymentDate);
        const diffTime = Date.now() - paymentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 1 && diffDays <= 2; // 1-2 kun orasida
      });

      return oneDayOverdue;
    } catch (error) {
      console.error('❌ 1 kun kechikkan to\'lovlarni olishda xatolik:', error.message);
      return [];
    }
  }

  // Kechikkan to'lovlarni topish (3 kun)
  async getOverduePayments3Days() {
    try {
      // Check if MongoDB is connected
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        console.warn('⚠️ MongoDB ulanmagan, so\'rovni o\'tkazib yuborish');
        return [];
      }

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      threeDaysAgo.setHours(23, 59, 59, 999);

      const customers = await Customer.find({
        'creditInfo.nextPaymentDate': {
          $lt: threeDaysAgo
        }
      })
      .populate('product')
      .populate('guarantor')
      .maxTimeMS(20000); // 20 second timeout for query

      // Faqat 3+ kun kechikkanlarni filter qilish
      const threeDaysOverdue = customers.filter(customer => {
        const paymentDate = new Date(customer.creditInfo.nextPaymentDate);
        const diffTime = Date.now() - paymentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 3; // 3+ kun kechikkan
      });

      return threeDaysOverdue;
    } catch (error) {
      console.error('❌ 3 kun kechikkan to\'lovlarni olishda xatolik:', error.message);
      return [];
    }
  }

  // Barcha eslatmalarni yuborish
  async sendPaymentReminders() {
    try {
      console.log('🔍 To\'lov eslatmalari tekshirilmoqda...');

      // Bugungi to'lovlar
      const todayPayments = await this.getTodayPayments();
      console.log(`📅 Bugun ${todayPayments.length} ta to'lov topildi`);

      if (todayPayments.length > 0) {
        console.log('📤 Bugungi to\'lovlar uchun xabarlar yuborilmoqda...');
        for (const customer of todayPayments) {
          const message = this.formatTodayPaymentMessage(customer);
          await this.sendMessage(message);
          console.log(`✅ ${customer.fullName} uchun bugungi to'lov xabari yuborildi`);
          
          // Xabarlar orasida kichik pauza
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 2 kun qolgan to'lovlar
      const upcomingPayments = await this.getUpcomingPayments();
      console.log(`⏰ 2 kun qolgan ${upcomingPayments.length} ta to'lov topildi`);

      if (upcomingPayments.length > 0) {
        console.log('📤 2 kun qolgan to\'lovlar uchun xabarlar yuborilmoqda...');
        for (const customer of upcomingPayments) {
          const message = this.formatUpcomingPaymentMessage(customer);
          await this.sendMessage(message);
          console.log(`✅ ${customer.fullName} uchun 2 kun qolgan xabari yuborildi`);
          
          // Xabarlar orasida kichik pauza
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 1 kun kechikkan to'lovlar
      const overdue1Day = await this.getOverduePayments1Day();
      console.log(`🚨 1 kun kechikkan ${overdue1Day.length} ta to'lov topildi`);

      if (overdue1Day.length > 0) {
        console.log('📤 1 kun kechikkan to\'lovlar uchun xabarlar yuborilmoqda...');
        for (const customer of overdue1Day) {
          const message = this.formatOverduePaymentMessage(customer, 1);
          await this.sendMessage(message);
          console.log(`✅ ${customer.fullName} uchun 1 kun kechikkan xabari yuborildi`);
          
          // Xabarlar orasida kichik pauza
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 3 kun kechikkan to'lovlar
      const overdue3Days = await this.getOverduePayments3Days();
      console.log(`🚨 3 kun kechikkan ${overdue3Days.length} ta to'lov topildi`);

      if (overdue3Days.length > 0) {
        console.log('📤 3 kun kechikkan to\'lovlar uchun xabarlar yuborilmoqda...');
        for (const customer of overdue3Days) {
          const message = this.formatOverduePaymentMessage(customer, 3);
          await this.sendMessage(message);
          console.log(`✅ ${customer.fullName} uchun 3 kun kechikkan xabari yuborildi`);
          
          // Xabarlar orasida kichik pauza
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (todayPayments.length === 0 && upcomingPayments.length === 0 && overdue1Day.length === 0 && overdue3Days.length === 0) {
        console.log('ℹ️ Hech qanday eslatma yuborish kerak emas');
      } else {
        console.log('✅ Barcha eslatmalar muvaffaqiyatli yuborildi');
      }
    } catch (error) {
      console.error('❌ Eslatmalarni yuborishda xatolik:', error.message);
    }
  }

  // Bot xizmatini boshlash (har 5 minutda tekshirish)
  startPaymentReminderService() {
    console.log('🤖 Telegram bot xizmati boshlandi - har 5 minutda tekshiriladi');
    console.log('📋 Bot Token:', this.botToken ? 'SET ✅' : 'NOT SET ❌');
    console.log('💬 Chat ID:', CHAT_ID);
    
    // Dastlab 30 soniya kutib, MongoDB ulanishini ta'minlash
    setTimeout(() => {
      console.log('🔍 Birinchi to\'lov eslatmalari tekshiruvi...');
      this.sendPaymentReminders();
    }, 30000); // 30 soniya kutish
    
    // Har 5 minutda (300000 ms) tekshirish
    setInterval(() => {
      const now = new Date();
      console.log(`\n⏰ ${now.toLocaleString('uz-UZ')} - To'lov eslatmalari tekshirilmoqda...`);
      this.sendPaymentReminders();
    }, 5 * 60 * 1000); // 5 minut
  }

  // Test xabari yuborish
  async sendTestMessage() {
    try {
      const testMessage = `🤖 <b>TELEGRAM BOT TEST</b>

✅ Bot muvaffaqiyatli ishlamoqda!
⏰ Vaqt: ${new Date().toLocaleString('uz-UZ')}
� Tekshirish: Har 5 minutda
📋 Vazifa: To'lov eslatmalari yuborish

<b>Eslatma turlari:</b>
📅 Bugun to'lov kuni
⏰ 2 kun qolgan to'lovlar

<i>Bot avtomatik ravishda ishlaydi va eslatmalar yuboradi.</i>`;

      await this.sendMessage(testMessage);
      console.log('✅ Test xabar muvaffaqiyatli yuborildi');
    } catch (error) {
      console.error('❌ Test xabar yuborishda xatolik:', error.message);
    }
  }
}

module.exports = new TelegramBot();