# 🚀 Production Setup Guide

## Pre-Deployment Checklist

### 1. ⚠️ XAVFSIZLIK (JUDA MUHIM!)

**GitHub'ga yuklashdan OLDIN:**

```bash
# .env faylini tekshiring
cat .env

# Agar sensitive ma'lumotlar bo'lsa, o'chiring
git rm --cached .env
git rm --cached client/.env.development

# .gitignore'da ekanligini tekshiring
cat .gitignore | grep .env
```

**Hech qachon GitHub'ga yuklmang:**
- ❌ Telegram Bot Token
- ❌ JWT Secret
- ❌ Database passwords
- ❌ SMS API tokens
- ❌ SSL certificates

### 2. 🔐 Environment Variables

**Server'da `.env` fayl yarating:**

```bash
# Server'ga kirish
ssh user@your-server.com

# Loyiha papkasiga o'tish
cd /var/www/ozodamebel

# .env fayl yaratish
nano .env
```

**Quyidagi ma'lumotlarni to'ldiring:**

```env
NODE_ENV=production
PORT=3008

# Database (MongoDB Atlas yoki local)
MONGODB_URI=mongodb://username:password@localhost:27017/furniture_crm?authSource=admin

# JWT (32+ characters, random string)
JWT_SECRET=your_super_secure_random_string_minimum_32_characters_here
JWT_EXPIRE=30d

# Telegram Bot (BotFather'dan olingan)
TELEGRAM_BOT_TOKEN=your_real_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# SMS API (Eskiz.uz)
SMS_API_URL=https://notify.eskiz.uz/api
SMS_API_TOKEN=your_sms_api_token

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Frontend URLs (sizning domeningiz)
FRONTEND_URL=https://ozoda.biznesjon.uz
ADMIN_URL=https://admin.ozoda.biznesjon.uz

# MongoDB Docker (agar Docker ishlatilsa)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password_here
MONGO_DB_NAME=furniture_crm
```

### 3. 📦 GitHub'ga Yuklash

```bash
# Git holatini tekshirish
git status

# .env faylini ignore qilish
echo ".env" >> .gitignore
echo "client/.env.development" >> .gitignore

# O'zgarishlarni commit qilish
git add .
git commit -m "chore: prepare for production deployment"

# GitHub'ga push qilish
git push origin main
```

### 4. 🖥️ Server Setup

#### A. Docker bilan (Tavsiya etiladi)

```bash
# Server'ga kirish
ssh user@your-server.com

# Docker va Docker Compose o'rnatish
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Loyihani klonlash
git clone https://github.com/your-username/ozodamebel.git
cd ozodamebel

# .env faylini yaratish (yuqoridagi qismga qarang)
nano .env

# SSL sertifikatlarini joylashtirish
mkdir ssl
# SSL fayllarini ssl/ papkasiga ko'chiring

# Docker Compose bilan ishga tushirish
docker-compose up -d

# Loglarni ko'rish
docker-compose logs -f
```

#### B. PM2 bilan (Traditional)

```bash
# Node.js o'rnatish
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 o'rnatish
sudo npm install -g pm2

# Loyihani klonlash
git clone https://github.com/your-username/ozodamebel.git
cd ozodamebel

# Dependencies o'rnatish
npm install
cd client && npm install && npm run build && cd ..

# .env faylini yaratish
nano .env

# PM2 bilan ishga tushirish
pm2 start server.js --name ozoda-backend
pm2 save
pm2 startup

# Nginx o'rnatish va konfiguratsiya qilish
sudo apt install nginx
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl restart nginx
```

### 5. 🔒 SSL Sertifikat (HTTPS)

#### Let's Encrypt bilan (Bepul)

```bash
# Certbot o'rnatish
sudo apt install certbot python3-certbot-nginx

# SSL sertifikat olish
sudo certbot --nginx -d ozoda.biznesjon.uz -d admin.ozoda.biznesjon.uz

# Avtomatik yangilanish
sudo certbot renew --dry-run
```

### 6. 🗄️ MongoDB Setup

#### A. MongoDB Atlas (Cloud - Tavsiya etiladi)

1. https://www.mongodb.com/cloud/atlas ga kiring
2. Yangi cluster yarating (M0 - bepul)
3. Database user yarating
4. IP whitelist qo'shing (0.0.0.0/0 yoki server IP)
5. Connection string oling
6. `.env` fayliga qo'shing:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/furniture_crm?retryWrites=true&w=majority
```

#### B. Local MongoDB

```bash
# MongoDB o'rnatish
sudo apt install mongodb-org

# Ishga tushirish
sudo systemctl start mongod
sudo systemctl enable mongod

# User yaratish
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["root"]
})
```

### 7. 🤖 Telegram Bot Setup

```bash
# BotFather'dan bot yaratish
# Telegram'da @BotFather'ga yozing
# /newbot buyrug'ini yuboring
# Bot nomini kiriting
# Token oling va .env'ga qo'shing

# Chat ID olish
# Bot'ga /start yuboring
# Quyidagi URL'ni brauzerda oching:
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates

# "chat":{"id":123456789} ni toping va .env'ga qo'shing
```

### 8. 📊 Monitoring

```bash
# PM2 monitoring
pm2 monit

# Docker logs
docker-compose logs -f app

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Health check
curl http://localhost:3008/api/health
```

### 9. 🔄 Deployment Script

```bash
# deploy.sh faylini executable qilish
chmod +x deploy.sh

# Deploy qilish
./deploy.sh
```

### 10. ✅ Post-Deployment Testing

```bash
# Health check
curl https://ozoda.biznesjon.uz/api/health

# Login test
curl -X POST https://ozoda.biznesjon.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"998901234567","password":"your_password"}'

# Telegram bot test
# Bot'ga /start yuboring

# File upload test
# Brauzerda mijoz qo'shib, rasm yuklang
```

## 🚨 Troubleshooting

### Port band
```bash
sudo lsof -i :3008
sudo kill -9 <PID>
```

### MongoDB connection error
```bash
# MongoDB ishlab turganini tekshirish
sudo systemctl status mongod

# Loglarni ko'rish
sudo tail -f /var/log/mongodb/mongod.log
```

### Nginx error
```bash
# Konfiguratsiyani tekshirish
sudo nginx -t

# Qayta yuklash
sudo systemctl restart nginx
```

### Docker issues
```bash
# Barcha konteynerlarni to'xtatish
docker-compose down

# Qayta ishga tushirish
docker-compose up -d --build

# Loglarni ko'rish
docker-compose logs -f
```

## 📞 Support

Muammolar bo'lsa:
1. GitHub Issues: https://github.com/your-username/ozodamebel/issues
2. Loglarni tekshiring
3. Health endpoint'ni tekshiring

---

**Muvaffaqiyatli deployment!** 🎉
