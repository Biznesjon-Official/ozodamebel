// Telefon raqamni formatlash
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Faqat raqamlarni olish
  const digits = phone.replace(/\D/g, '');
  
  // Agar 998 bilan boshlansa
  if (digits.startsWith('998')) {
    const number = digits.slice(3); // 998 dan keyingi qismni olish
    if (number.length === 9) {
      return `+998 ${number.slice(0, 2)} ${number.slice(2, 5)}-${number.slice(5, 7)}-${number.slice(7)}`;
    }
  }
  
  // Agar 9 bilan boshlansa (998 siz)
  if (digits.startsWith('9') && digits.length === 9) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
  }
  
  return phone;
};

// Telefon raqamni input uchun formatlash (faqat 9 ta raqam)
export const formatPhoneInput = (value) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Limit to 9 digits
  const limitedDigits = digits.slice(0, 9);
  
  // Format as XX XXX-XX-XX
  if (limitedDigits.length <= 2) {
    return limitedDigits;
  } else if (limitedDigits.length <= 5) {
    return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2)}`;
  } else if (limitedDigits.length <= 7) {
    return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2, 5)}-${limitedDigits.slice(5)}`;
  } else {
    return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2, 5)}-${limitedDigits.slice(5, 7)}-${limitedDigits.slice(7)}`;
  }
};

// Telefon raqami validatsiyasi
export const validatePhoneNumber = (phone) => {
  if (!phone) return false;
  
  const digits = phone.replace(/\D/g, '');
  
  // 9 ta raqam bo'lishi kerak
  if (digits.length !== 9) return false;
  
  // Har qanday 9 ta raqamni qabul qilish
  return true;
};

// Pul miqdorini formatlash
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0';
  return new Intl.NumberFormat('uz-UZ').format(amount);
};

// Input uchun pul formatlash (faqat raqamlar)
export const formatCurrencyInput = (value) => {
  // Faqat raqamlarni olish
  const digits = value.toString().replace(/\D/g, '');
  
  // Bo'sh bo'lsa 0 qaytarish
  if (!digits) return '';
  
  // Raqamni formatlash
  return new Intl.NumberFormat('uz-UZ').format(parseInt(digits));
};

// Formatlanган qiymatdan raqamni olish
export const parseCurrency = (formattedValue) => {
  if (!formattedValue) return 0;
  return parseInt(formattedValue.toString().replace(/\D/g, '')) || 0;
};

// Sanani formatlash (dd/mm/yyyy)
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Sanani input uchun formatlash (yyyy-mm-dd)
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Bugungi sanani tekshirish
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

// 2 kun qolganini tekshirish
export const isDueSoon = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  const twoDaysLater = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
  return checkDate.toDateString() === twoDaysLater.toDateString();
};

// Kunlar farqini hisoblash
export const getDaysUntil = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Pasport seriyasini formatlash (AA 1234567)
export const formatPassportInput = (value) => {
  // Faqat harflar va raqamlarni olish
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
  
  // Birinchi 2 ta belgini katta harf qilish
  const letters = cleaned.slice(0, 2).toUpperCase();
  
  // Keyingi 7 ta raqamni olish
  const numbers = cleaned.slice(2, 9).replace(/\D/g, '');
  
  // Format: AA 1234567
  if (letters.length === 0) {
    return '';
  } else if (letters.length < 2) {
    return letters;
  } else if (numbers.length === 0) {
    return letters;
  } else {
    return `${letters} ${numbers}`;
  }
};

// Pasport seriyasini validatsiya qilish
export const validatePassport = (passport) => {
  if (!passport) return false;
  
  // Bo'shliqlarni olib tashlash
  const cleaned = passport.replace(/\s/g, '');
  
  // Format: 2 ta harf + 7 ta raqam
  const regex = /^[A-Z]{2}\d{7}$/;
  return regex.test(cleaned);
};
