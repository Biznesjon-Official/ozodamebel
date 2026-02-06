# Furniture CRM - Mebel va Maishiy Texnika Muddatli To'lov Tizimi

Modern va to'liq funksional CRM tizimi mebel va maishiy texnika muddatli to'lov biznesini boshqarish uchun.

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

### 1. Repository klonlash
```bash
git clone <repository-url>
cd furniture-crm
```

### 2. Backend o'rnatish
```bash
# Dependencies o'rnatish
npm install

# Environment variables
cp .env.example .env
# .env faylini to'ldiring
```

### 3. Frontend o'rnatish
```bash
cd client
npm install
```

### 4. MongoDB o'rnatish
```bash
# MongoDB ishga tushiring
mongod
```

## 🚀 Ishga Tushirish

### Development Mode
```bash
# Backend (port 5000)
npm run dev

# Frontend (port 3000)
cd client
npm start
```

### Production Mode
```bash
# Frontend build
cd client
npm run build

# Server ishga tushirish
npm start
```

## 🔧 Konfiguratsiya

### Environment Variables (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/furniture_crm
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# SMS API
SMS_API_URL=https://notify.eskiz.uz/api
SMS_API_TOKEN=your_sms_token_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=8250571639:AAFEKgWrZYmbd5irQSDc-PpfhMtpGMoy-ns
TELEGRAM_CHAT_ID=your_chat_id

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Telegram Bot O'rnatish
```bash
# Bot ma'lumotlarini tekshirish
curl -X GET "https://api.telegram.org/bot8250571639:AAFEKgWrZYmbd5irQSDc-PpfhMtpGMoy-ns/getMe"

# Webhook o'rnatish
curl -X POST "https://api.telegram.org/bot8250571639:AAFEKgWrZYmbd5irQSDc-PpfhMtpGMoy-ns/setWebhook" \
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

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

## 📄 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi. Batafsil ma'lumot uchun `LICENSE` faylini ko'ring.

## 📞 Qo'llab-quvvatlash

Savollar yoki muammolar bo'lsa:
- Issue oching GitHub da
- Email: support@furniturecrm.uz
- Telegram: @furniture_crm_support

---

**Furniture CRM** - Zamonaviy muddatli to'lov biznesini boshqarish uchun to'liq yechim! 🚀# Ozoda_mebel
# Ozoda_mebel
