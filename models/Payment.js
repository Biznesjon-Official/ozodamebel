const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Shartnoma
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  
  // To'lov ma'lumotlari
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'terminal', 'click', 'payme', 'bank_transfer'],
    required: true
  },
  
  // To'lov turi
  paymentType: {
    type: String,
    enum: ['down_payment', 'installment', 'penalty', 'early_payment'],
    required: true
  },
  
  // Qaysi to'lov uchun
  installmentNumber: {
    type: Number
  },
  
  // Tranzaksiya ma'lumotlari
  transactionId: {
    type: String
  },
  reference: {
    type: String
  },
  
  // To'lov holati
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  
  // Izohlar
  notes: {
    type: String
  },
  
  // Qabul qiluvchi
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Kassa ma'lumotlari
  cashRegister: {
    type: String
  }
}, {
  timestamps: true
});

// Indekslar
paymentSchema.index({ contract: 1 });
paymentSchema.index({ paymentDate: 1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ status: 1 });

// Penya hisoblash funksiyasi
paymentSchema.statics.calculatePenalty = function(contract, dueDate, paymentDate = new Date()) {
  if (!contract || !dueDate) return 0;
  
  const due = new Date(dueDate);
  const payment = new Date(paymentDate);
  
  // Agar muddatida to'langan bo'lsa, penya yo'q
  if (payment <= due) return 0;
  
  // Kechikkan kunlar soni
  const daysLate = Math.ceil((payment - due) / (1000 * 60 * 60 * 24));
  
  // Penya stavkasi (kuniga 0.1% yoki shartnomadagi stavka)
  const penaltyRate = contract.financial?.penaltyRate || 0.001; // 0.1%
  const monthlyPayment = contract.financial?.monthlyPayment || 0;
  
  // Penya miqdori = oylik to'lov * penya stavkasi * kechikkan kunlar
  const penalty = monthlyPayment * penaltyRate * daysLate;
  
  return Math.round(penalty);
};

// To'lov qo'shilganda shartnomadagi paymentSchedule ni yangilash
paymentSchema.post('save', async function() {
  if (this.paymentType === 'installment' && this.status === 'completed') {
    try {
      const Contract = mongoose.model('Contract');
      const contract = await Contract.findById(this.contract);
      
      if (contract && contract.paymentSchedule) {
        // Tegishli installment'ni topish va yangilash
        const installment = contract.paymentSchedule.find(
          p => p.installmentNumber === this.installmentNumber
        );
        
        if (installment) {
          installment.status = 'paid';
          installment.paidDate = this.paymentDate;
          installment.paidAmount = (installment.paidAmount || 0) + this.amount;
          
          await contract.save();
        }
      }
    } catch (error) {
      console.error('Payment schedule yangilashda xatolik:', error);
    }
  }
});

module.exports = mongoose.model('Payment', paymentSchema);