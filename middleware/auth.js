const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// JWT token tekshirish
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: 'Foydalanuvchi topilmadi yoki bloklangan' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token yaroqsiz' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token topilmadi' });
  }
};

// Role tekshirish
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Bu amalni bajarish uchun ruxsat yo\'q' 
      });
    }
    next();
  };
};

// Audit log yozish
const auditLog = (action, resourceType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Muvaffaqiyatli amallar uchun audit log yozish
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const logData = {
          user: req.user._id,
          action,
          resourceType,
          resourceId: req.params.id || req.body._id,
          description: `${action} ${resourceType}`,
          metadata: {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
          }
        };
        
        // O'zgarishlarni saqlash
        if (req.originalData && req.body) {
          logData.changes = {
            before: req.originalData,
            after: req.body
          };
        }
        
        AuditLog.create(logData).catch(console.error);
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = { protect, authorize, auditLog };