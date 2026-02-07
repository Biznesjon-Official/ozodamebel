const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  // Shaxsiy ma'lumotlar
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v && v.toString().startsWith('998') && v.toString().length === 12;
      },
      message: 'Telefon raqami 998 bilan boshlanishi va 12 ta raqamdan iborat bo\'lishi kerak'
    }
  },
  birthDate: {
    type: Date,
    required: false
  },
  
  // Manzil ma'lumotlari
  region: {
    type: String,
    required: false
  },
  district: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  houseNumber: {
    type: String,
    required: false
  },
  
  // Pasport ma'lumotlari
  passportSeries: {
    type: String,
    required: false
  },
  
  // Profil rasmlari
  profileImages: [{
    type: String,
    required: false
  }],
  
  // Kafil ma'lumotlari
  guarantor: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v && v.toString().startsWith('998') && v.toString().length === 12;
        },
        message: 'Kafil telefon raqami 998 bilan boshlanishi va 12 ta raqamdan iborat bo\'lishi kerak'
      }
    },
    birthDate: {
      type: Date,
      required: false
    },
    region: {
      type: String,
      required: false
    },
    district: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    houseNumber: {
      type: String,
      required: false
    },
    passportSeries: {
      type: String,
      required: false
    }
  },
  
  // Mahsulot ma'lumotlari
  product: {
    name: {
      type: String,
      required: true
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    profitPercentage: {
      type: Number,
      required: false,
      min: 0,
      max: 100,
      default: 0
    },
    markupAmount: {
      type: Number,
      required: false,
      min: 0,
      default: 0
    },
    markupType: {
      type: String,
      enum: ['percent', 'amount'],
      default: 'percent'
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    installmentMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 24
    },
    monthlyPayment: {
      type: Number,
      required: true,
      min: 0
    }
  },
  
  // Kredit ma'lumotlari
  creditInfo: {
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    nextPaymentDate: {
      type: Date,
      required: false
    },
    initialPayment: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPaid: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      required: true
    },
    paidMonths: {
      type: Number,
      default: 0
    }
  },
  
  // Mijoz holati
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
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

// Indekslar
customerSchema.index({ phone: 1 });
customerSchema.index({ fullName: 'text' });
customerSchema.index({ 'guarantor.phone': 1 });
customerSchema.index({ 'creditInfo.nextPaymentDate': 1 });

// Keyingi to'lov sanasini avtomatik hisoblash
customerSchema.pre('save', function(next) {
  if (this.isNew) {
    // Yangi mijoz uchun keyingi to'lov sanasini hisoblash (agar kiritilmagan bo'lsa)
    if (!this.creditInfo.nextPaymentDate) {
      const startDate = this.creditInfo.startDate || new Date();
      const nextMonth = new Date(startDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      this.creditInfo.nextPaymentDate = nextMonth;
    }
    
    // Qolgan summani hisoblash (sotiladigan narx - boshlang'ich to'lov)
    const initialPayment = this.creditInfo.initialPayment || 0;
    this.creditInfo.remainingAmount = this.product.sellingPrice - initialPayment;
    this.creditInfo.totalPaid = initialPayment;
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema);