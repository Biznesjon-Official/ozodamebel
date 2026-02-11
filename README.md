# Ozoda Mebel CRM - Mebel va Maishiy Texnika Muddatli To'lov Tizimi

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)

Modern va to'liq funksional CRM tizimi mebel va maishiy texnika muddatli to'lov biznesini boshqarish uchun.

## 📋 Mundarija

- [Asosiy Xususiyatlar](#-asosiy-xususiyatlar)
- [Texnologiyalar](#-texnologiyalar)
- [O'rnatish](#-ornatish)
- [Ishga Tushirish](#-ishga-tushirish)
- [Production Deployment](#-production-deployment)
- [API Endpoints](#-api-endpoints)
- [Hissa Qo'shish](#-hissa-qoshish)
- [Litsenziya](#-litsenziya)

## 🚀 Asosiy Xususiyatlar

### 📊 CRM - Mijozlar va Kafillar Moduli
- **Mijoz Profili**: To'liq shaxsiy ma'lumotlar, pasport, aloqa, manzil
- **Kafil Tizimi**: Kafillarni qidirish, yaratish va boshqarish
- **Hujjat Boshqaruvi**: Pasport, selfie, mahsulot rasmlari
- **Geolokatsiya**: Google/Yandex koordinatalar

### 📄 Shartnoma Generatori (Yangilangan)
- **"TOVARNI NASIYAGA SOTISH SHARTNOMASI"**: Yuridik standartlarga mos
- **7 Bo'limli Struktura**: Predmet, bahosi, majburiyatlar, penya, kafil, nizolar, rekvizitlar
- **Professional Jadvallar**: Mahsulot jadvali va amortizatsiya jadvali
- **Avtomatik Hisoblash**: To'lov jadvali va qolgan qarz miqdori
- **3 Xil PDF**: Asosiy shartnoma, kafillik shartnomasi, to'lov jadvali
- **Yuridik Til**: Rasmiy va professional matn

### 🔔 Monitoring va Xabarlar
- **SMS Xabarlari**: Eskiz.uz API orqali
- **Telegram Bot**: Avtomatik xabarlar va monitoring
- **Qo'ng'iroq Vazifalari**: Operator uchun tasklar
- **Penya Hisobi**: Avtomatik jarima hisoblash

### 💰 Moliya va Kassa
- **To'lov Turlari**: Naqd, karta, Click, Payme
- **Kassa Boshqaruvi**: To'lovlarni qabul qilish
- **Hisobotlar**: Kunlik, oylik, yillik
- **Tranzaksiya Tarixi**: To'liq audit trail

### 👥 Foydalanuvchi Rollari
- **Admin**: To'liq tizim boshqaruvi
- **Operator**: Mijozlar va shartnomalar
- **Collector**: To'lovlar va qarzdorlar
- **Auditor**: Hisobotlar va monitoring

## 🛠 Texnologiyalar

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Ma'lumotlar bazasi
- **JWT** - Autentifikatsiya
- **PDFKit** - PDF generatsiya
- **Multer** - Fayl yuklash
- **Node-cron** - Scheduler
- **Axios** - HTTP client

### Frontend
- **React 18** - UI framework
- **TanStack Query** - Server state management
- **React Router v6** - Routing
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animatsiyalar
- **React Hook Form** - Form boshqaruvi
- **Zustand** - Client state management

### Integratsiyalar
- **Telegram Bot API** - Xabarlar va monitoring
- **Eskiz.uz SMS API** - SMS xabarlari
- **Google Maps** - Geolokatsiya

## 📦 O'rnatish

### Talablar

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 7.0
- Git

### 1. Repository klonlash

```bash
git clone https://github.com/Biznesjon-Official/ozodamebel.git
cd ozodamebel
```

### 2. Backend o'rnatish

```bash
# Dependencies o'rnatish
npm install

# Environment variables
cp .env.example .env
# .env faylini to'ldiring (quyidagi qismga qarang)
```

### 3. Frontend o'rnatish

```bash
cd client
npm install
cd ..
```

### 4. MongoDB o'rnatish

**Local MongoDB:**
```bash
# Ubuntu/Debian
sudo apt install mongodb-org

# macOS
brew install mongodb-community

# MongoDB ishga tushirish
sudo systemctl start mongod
```

**Yoki MongoDB Atlas (Cloud):**
1. https://www.mongodb.com/cloud/atlas ga kiring
2. Yangi cluster yarating
3. Connection string oling
4. `.env` fayliga qo'shing

## 🚀 Ishga Tushirish

### Development Mode

```bash
# Backend va Frontend birga ishga tushirish
npm run dev

# Yoki alohida:
# Backend (port 3008)
npm run dev:server

# Frontend (port 3000)
npm run dev:client
```

Brauzerda oching: http://localhost:3000

### Production Mode

```bash
# Frontend build
npm run build:client

# Server ishga tushirish
npm start

# Yoki PM2 bilan:
pm2 start ecosystem.config.js
```

## 🌐 Production Deployment

### Docker bilan (Tavsiya etiladi)

```bash
# .env faylini yaratish
cp .env.production.example .env
# Haqiqiy ma'lumotlarni kiriting

# Docker Compose bilan ishga tushirish
docker-compose up -d

# Loglarni ko'rish
docker-compose logs -f

# To'xtatish
docker-compose down
```

### PM2 bilan (Traditional)

```bash
# PM2 o'rnatish
npm install -g pm2

# Ishga tushirish
pm2 start ecosystem.config.js

# Status
pm2 status

# Logs
pm2 logs

# Monitoring
pm2 monit

# Qayta ishga tushirish
pm2 restart ozoda-mebel-backend

# To'xtatish
pm2 stop ozoda-mebel-backend
```

### Batafsil Deployment Qo'llanmasi

To'liq production deployment qo'llanmasi uchun [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) faylini o'qing.

## 🔧 Konfiguratsiya

### Environment Variables (.env)

```env
# Environment
NODE_ENV=development
PORT=3008

# Database
MONGODB_URI=mongodb://localhost:27017/furniture_crm

# JWT
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRE=30d

# SMS API (Eskiz.uz)
SMS_API_URL=https://notify.eskiz.uz/api
SMS_API_TOKEN=your_sms_token_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Frontend URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000
```

**⚠️ MUHIM:** Production'da `.env` faylini hech qachon GitHub'ga yuklmang!

### Telegram Bot O'rnatish
```bash
# Bot ma'lumotlarini tekshirish
curl -X GET "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"

# Webhook o'rnatish
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourdomain.com/api/telegram/webhook"}'
```

## 📱 Telegram Bot Buyruqlari

- `/start` - Botni ishga tushirish
- `/stats` - Tizim statistikasi
- `/overdue` - Kechikkan to'lovlar
- `/today` - Bugungi to'lovlar
- `/help` - Yordam

**Mijoz qidirish**: Telefon raqam yuboring (masalan: +998901234567)

## 🔐 API Endpoints

### Autentifikatsiya
- `POST /api/auth/login` - Tizimga kirish
- `POST /api/auth/logout` - Tizimdan chiqish
- `GET /api/auth/me` - Joriy foydalanuvchi

### Mijozlar
- `GET /api/customers` - Mijozlar ro'yxati
- `POST /api/customers` - Yangi mijoz
- `GET /api/customers/:id` - Mijoz ma'lumotlari
- `PUT /api/customers/:id` - Mijozni yangilash

### Shartnomalar
- `GET /api/contracts` - Shartnomalar ro'yxati
- `POST /api/contracts` - Yangi shartnoma
- `GET /api/contracts/:id/pdf` - PDF yuklab olish

### To'lovlar
- `GET /api/payments` - To'lovlar tarixi
- `POST /api/payments` - To'lov qabul qilish

## 📊 Biznes Qiymati

✅ **Kechikishlarni kamaytiradi** - Avtomatik eslatmalar
✅ **Qarzni qaytarish darajasini oshiradi** - Kafil tizimi
✅ **Shartnomalarni standartlashtiradi** - PDF generatsiya
✅ **Kafillik mexanizmini faollashtiradi** - Yuridik javobgarlik
✅ **Moliyaviy shaffoflikni oshiradi** - To'liq hisobotlar
✅ **Operator yukini kamaytiradi** - Avtomatlashtirish
✅ **Hisobotlarni tezlashtiradi** - Real-time analytics

## 🤝 Hissa Qo'shish

Hissa qo'shish uchun [CONTRIBUTING.md](CONTRIBUTING.md) faylini o'qing.

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'feat: add some amazing feature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

## 🔒 Xavfsizlik

Xavfsizlik muammolarini topgan bo'lsangiz, [SECURITY.md](SECURITY.md) faylini o'qing va security@ozodamebel.uz ga xabar bering.

## 📝 Changelog

Barcha o'zgarishlar [CHANGELOG.md](CHANGELOG.md) faylida qayd etilgan.

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi. Batafsil ma'lumot uchun [LICENSE](LICENSE) faylini ko'ring.

## 📞 Qo'llab-quvvatlash

Savollar yoki muammolar bo'lsa:
- GitHub Issues: https://github.com/Biznesjon-Official/ozodamebel/issues
- Email: support@ozodamebel.uz
- Telegram: @ozoda_mebel_support

## 🙏 Minnatdorchilik

- [Express.js](https://expressjs.com/) - Backend framework
- [React](https://reactjs.org/) - Frontend library
- [MongoDB](https://www.mongodb.com/) - Database
- [Telegram Bot API](https://core.telegram.org/bots/api) - Bot integration
- [Eskiz.uz](https://eskiz.uz/) - SMS service

---

**Ozoda Mebel CRM** - Zamonaviy muddatli to'lov biznesini boshqarish uchun to'liq yechim! 🚀

Made with ❤️ by Ozoda Mebel Team
