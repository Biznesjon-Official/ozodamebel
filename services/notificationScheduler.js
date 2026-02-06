const cron = require('node-cron');
const Contract = require('../models/Contract');
const Guarantor = require('../models/Guarantor');
const Notification = require('../models/Notification');
const notificationService = require('./notificationService');

class NotificationScheduler {
  constructor() {
    this.jobs = [];
  }

  /**
   * Barcha cron joblarni ishga tushirish
   */
  start() {
    console.log('🚀 Notification scheduler ishga tushirildi');
    
    // Kunlik hisobot - har kuni soat 9:00 da
    const dailyReportJob = cron.schedule('0 9 * * *', async () => {
      console.log('📊 Kunlik hisobot yuborish...');
      await notificationService.sendDailyReport();
    }, {
      scheduled: false,
      timezone: 'Asia/Tashkent'
    });

    this.jobs.push(dailyReportJob);
    dailyReportJob.start();

    console.log('✅ Barcha cron joblar ishga tushirildi');
  }

  /**
   * Barcha cron joblarni to'xtatish
   */
  stop() {
    this.jobs.forEach(job => {
      if (job) {
        job.stop();
      }
    });
    console.log('🛑 Barcha cron joblar to\'xtatildi');
  }
}

module.exports = new NotificationScheduler();