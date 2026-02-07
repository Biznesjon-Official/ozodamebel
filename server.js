// dotenv'ni birinchi bo'lib yuklash
require('dotenv').config({ path: '.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

console.log('✅ .env fayl yuklandi');
console.log('🔧 Environment Variables:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   PORT:', process.env.PORT);
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

// Environment variables validation
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID'
];

console.log('🔍 Checking environment variables:');
requiredEnvVars.forEach(envVar => {
  console.log(`   ${envVar}:`, process.env[envVar] ? 'SET' : 'NOT SET');
});

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Rate limiting - development uchun yumshatilgan
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000, // 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Development da rate limiting ni skip qilish
    const isDev = process.env.NODE_ENV === 'development';
    const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.ip.includes('localhost');
    return isDev || isLocalhost;
  }
});

app.use('/api/', limiter);

// Auth endpoints uchun yumshatilgan rate limiting
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 attempts per 5 minutes
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 5 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Development da auth rate limiting ni skip qilish
    const isDev = process.env.NODE_ENV === 'development';
    const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.ip.includes('localhost');
    return isDev || isLocalhost;
  }
});

app.use('/api/auth/login', authLimiter);

// Environment variables'ni log qilish
console.log('🔧 Environment Variables:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   PORT:', process.env.PORT);
console.log('   MONGODB_URI:', process.env.MONGODB_URI);
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-upload-type']
}));
// Body parsing middleware - no size limits for file uploads
app.use(express.json({ 
  limit: '100mb'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '100mb'
}));
app.use('/uploads', express.static('uploads'));

// MongoDB ulanishi
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furniture_installment', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB ga muvaffaqiyatli ulandi');
})
.catch((error) => {
  console.error('MongoDB ulanish xatoligi:', error);
});

const { globalErrorHandler } = require('./middleware/errorHandler');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/guarantors', require('./routes/guarantors'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/telegram', require('./routes/telegram'));
app.use('/api/telegram-bot', require('./routes/telegramBot'));
app.use('/api/test', require('./routes/test'));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Database connection check
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Memory usage
    const memUsage = process.memoryUsage();
    
    // Uptime
    const uptime = process.uptime();
    
    res.json({ 
      success: true, 
      message: 'API is healthy!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      status: {
        database: dbStatus,
        uptime: `${Math.floor(uptime / 60)} minutes`,
        memory: {
          used: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
          total: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`
        },
        port: process.env.PORT || 3008,
        pid: process.pid
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed health check with database test
app.get('/api/health/detailed', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Database ping test
    let dbTest = false;
    let dbError = null;
    try {
      await mongoose.connection.db.admin().ping();
      dbTest = true;
    } catch (err) {
      dbError = err.message;
    }
    
    // Response time
    const responseTime = Date.now() - startTime;
    
    const health = {
      success: true,
      message: 'Detailed health check',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
      responseTime: `${responseTime}ms`,
      checks: {
        database: {
          status: dbTest ? 'healthy' : 'unhealthy',
          connection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          error: dbError
        },
        memory: {
          used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
          total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
          percentage: `${Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)}%`
        },
        uptime: {
          seconds: Math.floor(process.uptime()),
          formatted: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`
        },
        system: {
          port: process.env.PORT || 3008,
          pid: process.pid,
          platform: process.platform,
          nodeVersion: process.version
        }
      }
    };
    
    // Set status code based on health
    const statusCode = dbTest ? 200 : 503;
    res.status(statusCode).json(health);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} topilmadi`
  });
});

// Static files (React build)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
} else {
  // Development mode - serve a simple message
  app.get('/', (req, res) => {
    res.json({
      message: 'Ozoda Mebel API - Development Mode',
      frontend: 'http://localhost:3000',
      api: `http://localhost:${PORT}/api`,
      health: `http://localhost:${PORT}/api/health`
    });
  });
}

// Global error handler (must be last)
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3008;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portda ishlamoqda`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated');
  });
});

// Notification scheduler
require('./services/notificationScheduler');

// Telegram bot xizmati - to'lov eslatmalari
const telegramBot = require('./services/telegramBot');
telegramBot.startPaymentReminderService();

// Telegram polling (localhost uchun)
if (process.env.NODE_ENV === 'development') {
  const telegramPolling = require('./services/telegramPolling');
  telegramPolling.startPolling();
}