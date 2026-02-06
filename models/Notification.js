const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Shartnoma
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  
  // Qabul qiluvchi
  recipient: {
    type: String,
    enum: ['customer', 'guarantor'],
    required: true
  },
  
  // Xabar turi
  type: {
    type: String,
    enum: ['reminder', 'warning', 'overdue', 'penalty'],
    required: true
  },
  
  // Kanal
  channel: {
    type: String,
    enum: ['sms', 'telegram', 'call'],
    required: true
  },
  
  // Xabar matni
  message: {
    type: String,
    required: true
  },
  
  // Telefon raqami
  phoneNumber: {
    type: String,
    required: true
  },
  
  // Jo'natish holati
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  
  // Jo'natish vaqti
  scheduledDate: {
    type: Date,
    required: true
  },
  sentDate: {
    type: Date
  },
  
  // Javob ma'lumotlari
  response: {
    code: String,
    message: String,
    messageId: String
  },
  
  // Qayta urinishlar
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  
  // Yaratuvchi
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indekslar
notificationSchema.index({ contract: 1 });
notificationSchema.index({ scheduledDate: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ channel: 1 });

module.exports = mongoose.model('Notification', notificationSchema);