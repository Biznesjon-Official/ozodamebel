const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Common validation rules
const phoneValidation = body('phone')
  .matches(/^\+998[0-9]{9}$/)
  .withMessage('Telefon raqam +998XXXXXXXXX formatida bo\'lishi kerak');

const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Email formati noto\'g\'ri');

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Parol kamida 8 ta belgidan iborat bo\'lishi kerak')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage('Parol katta va kichik harflar, raqam va maxsus belgilarni o\'z ichiga olishi kerak');

const passportValidation = body('passport')
  .matches(/^[A-Z]{2}[0-9]{7}$/)
  .withMessage('Passport seriya va raqami AA1234567 formatida bo\'lishi kerak');

const pinflValidation = body('pinfl')
  .matches(/^[0-9]{14}$/)
  .withMessage('PINFL 14 ta raqamdan iborat bo\'lishi kerak');

const innValidation = body('inn')
  .matches(/^[0-9]{9}$/)
  .withMessage('INN 9 ta raqamdan iborat bo\'lishi kerak');

const amountValidation = (field) => body(field)
  .isFloat({ min: 0 })
  .withMessage(`${field} musbat son bo\'lishi kerak`);

const dateValidation = (field) => body(field)
  .isISO8601()
  .withMessage(`${field} to\'g\'ri sana formatida bo\'lishi kerak`);

// User validation schemas
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username 3-30 ta belgi orasida bo\'lishi kerak')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username faqat harflar, raqamlar va _ belgisini o\'z ichiga olishi mumkin'),
  emailValidation,
  passwordValidation,
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('To\'liq ism 2-100 ta belgi orasida bo\'lishi kerak')
    .matches(/^[a-zA-ZА-Яа-яЁёўғқҳ\s]+$/)
    .withMessage('To\'liq ism faqat harflardan iborat bo\'lishi kerak'),
  phoneValidation,
  body('role')
    .isIn(['admin', 'operator', 'collector', 'auditor'])
    .withMessage('Noto\'g\'ri rol'),
  handleValidationErrors
];

const loginValidation = [
  body('username')
    .notEmpty()
    .withMessage('Username kiritilishi shart'),
  body('password')
    .notEmpty()
    .withMessage('Parol kiritilishi shart'),
  handleValidationErrors
];

// Customer validation schemas
const customerValidation = [
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .withMessage('To\'liq ism 2-100 ta belgi orasida bo\'lishi kerak'),
  phoneValidation,
  emailValidation.optional(),
  passportValidation,
  pinflValidation,
  body('address.region')
    .notEmpty()
    .withMessage('Viloyat kiritilishi shart'),
  body('address.district')
    .notEmpty()
    .withMessage('Tuman kiritilishi shart'),
  body('address.street')
    .isLength({ min: 5, max: 200 })
    .withMessage('Ko\'cha manzili 5-200 ta belgi orasida bo\'lishi kerak'),
  body('birthDate')
    .isISO8601()
    .withMessage('Tug\'ilgan sana noto\'g\'ri formatda')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 100) {
        throw new Error('Yosh 18-100 orasida bo\'lishi kerak');
      }
      return true;
    }),
  handleValidationErrors
];

// Contract validation schemas
const contractValidation = [
  body('customer')
    .isMongoId()
    .withMessage('Noto\'g\'ri mijoz ID'),
  body('guarantor')
    .optional()
    .isMongoId()
    .withMessage('Noto\'g\'ri kafil ID'),
  body('product.name')
    .isLength({ min: 2, max: 200 })
    .withMessage('Mahsulot nomi 2-200 ta belgi orasida bo\'lishi kerak'),
  body('product.category')
    .notEmpty()
    .withMessage('Mahsulot kategoriyasi kiritilishi shart'),
  amountValidation('financial.basePrice'),
  amountValidation('financial.downPayment'),
  amountValidation('financial.creditAmount'),
  body('financial.installmentMonths')
    .isInt({ min: 1, max: 60 })
    .withMessage('Muddatli to\'lov oyi 1-60 orasida bo\'lishi kerak'),
  body('financial.interestRate')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Foiz stavkasi 0-100 orasida bo\'lishi kerak'),
  dateValidation('startDate'),
  handleValidationErrors
];

// Payment validation schemas
const paymentValidation = [
  body('contract')
    .isMongoId()
    .withMessage('Noto\'g\'ri shartnoma ID'),
  amountValidation('amount'),
  body('paymentMethod')
    .isIn(['cash', 'card', 'terminal', 'click', 'payme', 'bank_transfer'])
    .withMessage('Noto\'g\'ri to\'lov usuli'),
  body('paymentType')
    .isIn(['down_payment', 'installment', 'penalty', 'early_payment'])
    .withMessage('Noto\'g\'ri to\'lov turi'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Izoh 500 ta belgidan oshmasligi kerak'),
  handleValidationErrors
];

// ID validation
const mongoIdValidation = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage('Noto\'g\'ri ID format'),
  handleValidationErrors
];

// Pagination validation
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sahifa raqami musbat son bo\'lishi kerak'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit 1-100 orasida bo\'lishi kerak'),
  query('sort')
    .optional()
    .matches(/^[a-zA-Z_]+:(asc|desc)$/)
    .withMessage('Sort formati field:asc yoki field:desc bo\'lishi kerak'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  customerValidation,
  contractValidation,
  paymentValidation,
  mongoIdValidation,
  paginationValidation,
  phoneValidation,
  emailValidation,
  passwordValidation,
  passportValidation,
  pinflValidation,
  innValidation,
  amountValidation,
  dateValidation
};