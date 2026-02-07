# 🚀 Deployment Guide - O'zgarishlarni Serverga Qo'llash

## ✅ Amalga oshirilgan tuzatmalar:

### 1. **File Size Limit oshirildi**
- Server: 10MB → 50MB
- Nginx: 10M → 50M
- Multer: 10MB → 50MB

### 2. **Rasm Compression qo'shildi**
- Maksimal o'lcham: 1920x1080
- JPEG quality: 70%
- Avtomatik aspect ratio saqlanadi

### 3. **Error Handling yaxshilandi**
- JSON response tekshiruvi
- Aniq xatolik xabarlari
- Batafsil console logging

---

## 📦 Serverga Deploy qilish:

### **1. Server'ga kirish:**
```bash
ssh user@ozoda.biznesjon.uz
```

### **2. Loyihani yangilash:**
```bash
cd /path/to/ozodamebel
git pull origin main
```

### **3. Dependencies'ni yangilash:**
```bash
npm install
cd client && npm install && cd ..
```

### **4. Client'ni build qilish:**
```bash
cd client
npm run build
cd ..
```

### **5. Nginx'ni qayta yuklash:**
```bash
sudo nginx -t  # Konfiguratsiyani tekshirish
sudo systemctl reload nginx  # Nginx'ni qayta yuklash
```

### **6. Node.js server'ni qayta ishga tushirish:**
```bash
# PM2 ishlatilsa:
pm2 restart ozoda-backend

# yoki
pm2 restart all

# PM2 ishlatilmasa:
npm start
```

### **7. Loglarni tekshirish:**
```bash
# PM2 logs
pm2 logs ozoda-backend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🧪 Test qilish:

### **1. Health Check:**
```bash
curl https://a.biznesjon.uz/api/health
```

Kutilayotgan javob:
```json
{
  "success": true,
  "message": "API is healthy!",
  "status": {
    "database": "connected"
  }
}
```

### **2. Upload Test:**
Telefonda:
1. Saytni oching: https://a.biznesjon.uz
2. Login qiling
3. Mijoz qo'shish
4. Kameradan rasm olish
5. Saqlash

### **3. Console Loglarni tekshirish:**
Browser Console'da:
```
📸 Original blob size: 2048576 bytes
📸 Compressed file size: 512000 bytes
📤 Uploading to: https://a.biznesjon.uz/api/upload
📤 Response status: 200
✅ Image added to URLs array
```

---

## 🚨 Agar muammo bo'lsa:

### **Muammo 1: Nginx xatolik beradi**
```bash
sudo nginx -t
```
Xatolikni ko'rsatadi va qaysi qatorda ekanligini aytadi.

### **Muammo 2: PM2 ishlamayapti**
```bash
pm2 list  # Barcha processlarni ko'rish
pm2 restart all  # Barchasini qayta ishga tushirish
pm2 logs  # Loglarni ko'rish
```

### **Muammo 3: Port band**
```bash
sudo lsof -i :3008  # Port 3008'ni kim ishlatayotganini ko'rish
sudo kill -9 <PID>  # Processni to'xtatish
```

### **Muammo 4: Ruxsat muammosi**
```bash
# Uploads papkasiga ruxsat berish
sudo chown -R $USER:$USER /path/to/ozodamebel/uploads
sudo chmod -R 755 /path/to/ozodamebel/uploads
```

---

## 📊 Monitoring:

### **Server Resources:**
```bash
# CPU va Memory
htop

# Disk space
df -h

# PM2 monitoring
pm2 monit
```

### **Nginx Status:**
```bash
sudo systemctl status nginx
```

### **Node.js Process:**
```bash
pm2 status
pm2 info ozoda-backend
```

---

## 🔄 Rollback (Agar muammo bo'lsa):

### **1. Oldingi versiyaga qaytish:**
```bash
git log --oneline  # Commit'larni ko'rish
git checkout <previous-commit-hash>
```

### **2. Server'ni qayta ishga tushirish:**
```bash
npm install
cd client && npm install && npm run build && cd ..
pm2 restart all
sudo systemctl reload nginx
```

---

## ✅ Deployment Checklist:

- [ ] Git pull qilindi
- [ ] npm install bajarildi
- [ ] Client build qilindi
- [ ] Nginx konfiguratsiya tekshirildi
- [ ] Nginx qayta yuklandi
- [ ] PM2 restart qilindi
- [ ] Health check ishlayapti
- [ ] Upload test qilindi
- [ ] Loglar tekshirildi
- [ ] Production'da test qilindi

---

## 📞 Qo'shimcha yordam:

Agar muammo davom etsa:
1. PM2 loglarni screenshot qiling
2. Nginx error loglarni screenshot qiling
3. Browser console loglarni screenshot qiling
4. Network tab'ni screenshot qiling

---

**Oxirgi yangilanish:** 2026-02-07  
**Commit:** `41bcf3f`  
**Status:** ✅ GitHub'ga yuklandi, deploy qilishga tayyor
