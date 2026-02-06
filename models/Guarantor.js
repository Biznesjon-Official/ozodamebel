const mongoose = require('mongoose');

const guarantorSchema = new mongoose.Schema({
  // Shaxsiy ma'lumotlar (Customer bilan bir xil)
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['erkak', 'ayol'],
    required: true
  },
  
  // Pasport ma'lumotlari
  passport: {
    series: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length >= 2;
        },
        message: 'Pasport seriyasi kamida 2 ta belgi bo\'lishi kerak'
      }
    },
    number: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v && v.length >= 6;
        },
        message: 'Pasport raqami kamida 6 ta raqam bo\'lishi kerak'
      }
    },
    issuedDate: {
      type: Date,
      required: false
    },
    issuedBy: {
      type: String,
      required: false
    }
  },
  
  // Aloqa ma'lumotlari
  contact: {
    primaryPhone: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Faqat 998 bilan boshlanishini tekshirish
          return v && v.toString().startsWith('998');
        },
        message: 'Telefon raqami 998 bilan boshlanishi kerak'
      }
    }
  },
  
  // Yashash manzili
  address: {
    region: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    neighborhood: {
      type: String,
      required: false // Made optional
    },
    street: {
      type: String,
      required: false // Made optional
    },
    fullAddress: {
      type: String,
      required: false // Added for the textarea field
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Ish joyi
  workplace: {
    organization: {
      type: String,
      required: false // Make it optional since user said it should be optional
    },
    position: {
      type: String,
      required: true
    },
    workPhone: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || v === '' || /^998\d{9}$/.test(v);
        },
        message: 'Telefon raqami 998 bilan boshlanib, 12 ta raqamdan iborat bo\'lishi kerak'
      }
    }
  },
  
  // Hujjatlar
  documents: [{
    type: {
      type: String,
      enum: ['passport_main', 'passport_registration'],
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Kafil holati
  status: {
    type: String,
    enum: ['active', 'blocked'],
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
guarantorSchema.index({ 'contact.primaryPhone': 1 });
guarantorSchema.index({ fullName: 'text' });

module.exports = mongoose.model('Guarantor', guarantorSchema);