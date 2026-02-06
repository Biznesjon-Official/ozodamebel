const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  // Shartnoma raqami
  contractNumber: {
    type: String,
    required: false,
    unique: false
  },
  
  // Mijoz va kafil
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  guarantor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guarantor',
    required: false // Kafil ixtiyoriy
  },
  relationshipType: {
    type: String,
    enum: ['ota', 'ona', 'aka', 'uka', 'opa', 'singil', 'tog\'a', 'amma', 'hamkasb', 'do\'st', 'boshqa'],
    required: true
  },
  
  // Mahsulot ma'lumotlari
  product: {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    model: String,
    serialNumber: String,
    description: String,
    soldBy: String, // Kim tomonidan sotilgan
    creditProvider: {
      type: String,
      default: 'Ozoda Mebel'
    }
  },
  
  // Moliyaviy ma'lumotlar
  financial: {
    basePrice: {
      type: Number,
      required: false,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    downPayment: {
      type: Number,
      required: true,
      min: 0
    },
    loanAmount: {
      type: Number,
      required: true,
      min: 0
    },
    interestRate: {
      type: Number,
      default: 0,
      min: 0
    },
    termMonths: {
      type: Number,
      required: true,
      min: 1
    },
    monthlyPayment: {
      type: Number,
      required: true,
      min: 0
    },
    penaltyRate: {
      type: Number,
      default: 0.1,
      min: 0
    }
  },
  
  // To'lov jadvali
  paymentSchedule: [{
    installmentNumber: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    principalAmount: {
      type: Number,
      required: true
    },
    interestAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    },
    paidDate: Date,
    paidAmount: {
      type: Number,
      default: 0
    }
  }],
  
  // Shartnoma holati
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled', 'defaulted'],
    default: 'draft'
  },
  
  // Sanalar
  signDate: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  nextPaymentDate: {
    type: Date,
    // This can be manually set to override calculated next payment date
  },
  
  // PDF fayllar
  documents: {
    contract: String,
    guarantorAgreement: String,
    paymentSchedule: String
  },
  
  // Yaratuvchi
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Shartnoma raqamini avtomatik generatsiya qilish va to'lov jadvalini yaratish
contractSchema.pre('save', async function(next) {
  // Shartnoma raqamini generatsiya qilish
  if (!this.contractNumber) {
    const count = await mongoose.model('Contract').countDocuments();
    const year = new Date().getFullYear();
    this.contractNumber = `SH-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  
  // To'lov jadvalini avtomatik yaratish
  if (this.isNew && this.financial && this.financial.termMonths > 0) {
    const { loanAmount, termMonths, interestRate } = this.financial;
    const startDate = new Date(this.startDate);
    
    // Oylik to'lov miqdorini hisoblash
    let monthlyPayment;
    if (interestRate > 0) {
      // Foizli kredit uchun
      const monthlyRate = interestRate / 100 / 12;
      monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                      (Math.pow(1 + monthlyRate, termMonths) - 1);
    } else {
      // Foizsiz kredit uchun
      monthlyPayment = loanAmount / termMonths;
    }
    
    // Oylik to'lovni saqlash
    this.financial.monthlyPayment = Math.round(monthlyPayment);
    
    // To'lov jadvalini yaratish
    this.paymentSchedule = [];
    let remainingBalance = loanAmount;
    
    for (let i = 1; i <= termMonths; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      let principalAmount, interestAmount;
      
      if (interestRate > 0) {
        // Foizli kredit uchun
        interestAmount = remainingBalance * (interestRate / 100 / 12);
        principalAmount = monthlyPayment - interestAmount;
      } else {
        // Foizsiz kredit uchun
        principalAmount = monthlyPayment;
        interestAmount = 0;
      }
      
      // Oxirgi to'lovda qoldiq summani to'lash
      if (i === termMonths) {
        principalAmount = remainingBalance;
        monthlyPayment = principalAmount + interestAmount;
      }
      
      this.paymentSchedule.push({
        installmentNumber: i,
        dueDate: dueDate,
        principalAmount: Math.round(principalAmount),
        interestAmount: Math.round(interestAmount),
        totalAmount: Math.round(principalAmount + interestAmount),
        status: 'pending',
        paidAmount: 0
      });
      
      remainingBalance -= principalAmount;
    }
  }
  
  next();
});

// Indekslar
contractSchema.index({ contractNumber: 1 });
contractSchema.index({ customer: 1 });
contractSchema.index({ guarantor: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ 'paymentSchedule.dueDate': 1 });

module.exports = mongoose.model('Contract', contractSchema);