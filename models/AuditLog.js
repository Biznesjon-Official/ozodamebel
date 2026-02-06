const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  // Foydalanuvchi
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Amal turi
  action: {
    type: String,
    enum: [
      'create', 'update', 'delete', 'view',
      'login', 'logout', 'password_change', 'profile_update',
      'payment_received', 'contract_signed',
      'notification_sent', 'document_uploaded'
    ],
    required: true
  },
  
  // Resurs turi
  resourceType: {
    type: String,
    enum: ['customer', 'guarantor', 'contract', 'payment', 'notification', 'user', 'document'],
    required: true
  },
  
  // Resurs ID
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  
  // O'zgarishlar
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  
  // Qo'shimcha ma'lumotlar
  metadata: {
    ipAddress: String,
    userAgent: String,
    sessionId: String
  },
  
  // Tavsif
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indekslar
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resourceType: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);