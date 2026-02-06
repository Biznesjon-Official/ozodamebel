// Backend uchun formatters

// Telefon raqamni formatlash
const formatPhoneNumber = (phone) => {
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

// Pul miqdorini formatlash
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0';
  return new Intl.NumberFormat('uz-UZ').format(amount);
};

// Sanani formatlash (dd/mm/yyyy)
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Bugungi sanani tekshirish
const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

// 2 kun qolganini tekshirish
const isDueSoon = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  const twoDaysLater = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000));
  return checkDate.toDateString() === twoDaysLater.toDateString();
};

module.exports = {
  formatPhoneNumber,
  formatCurrency,
  formatDate,
  isToday,
  isDueSoon
};