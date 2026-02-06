# Telegram Bot - To'lov Eslatmalari

## Bot Haqida
Bu bot har 5 minutda mijozlarning to'lov sanalarini tekshiradi va eslatmalar yuboradi:

- **Bugun to'lov kuni** bo'lgan mijozlar uchun
- **2 kun qolgan** to'lovlar uchun

## Bot Sozlamalari

### 1. Bot Token
```
8250571639:AAFEKgWrZYmbd5irQSDc-PpfhMtpGMoy-ns
```

### 2. Chat ID
```
5834939103
```

## Xabar Formatlari

### Bugun To'lov Kuni
```
📅 BUGUN TO'LOV KUNI

👤 Mijoz: Javohir Fozilov
📱 Telefon: +998 91 405-84-81
🛋 Mahsulot: iPhone 17
💰 To'lov miqdori: 2 796 so'm
📅 To'lov sanasi: 29/01/2026

🔔 BUGUN TO'LOV KUNI!
📞 Mijoz bilan bog'lanib, to'lovni eslatib qo'ying.
```

### 2 Kun Qolgan To'lov
```
🔔 TO'LOV ESLATMASI

👤 Mijoz: Javohir Fozilov
📱 Telefon: +998 91 405-84-81
🛋 Mahsulot: iPhone 17
💰 To'lov miqdori: 2 796 so'm
📅 To'lov sanasi: 31/01/2026

⏰ Oylik to'lov sanasiga atigi 2 kun qoldi!
📞 Mijoz bilan bog'lanib, eslatib qo'ying.
```

## API Endpointlar

### 1. Test Xabar Yuborish
```
POST /api/telegram-bot/test
```

### 2. Darhol Eslatma Yuborish
```
POST /api/telegram-bot/send-reminders
```

### 3. Bot Holatini Tekshirish
```
GET /api/telegram-bot/status
```

## Bot Ishga Tushirish

Bot server ishga tushganda avtomatik ishlay boshlaydi:

```bash
npm run dev
# yoki
npm start
```

## Xususiyatlar

- ✅ Har 5 minutda avtomatik tekshirish
- ✅ Bugun to'lov kuni bo'lgan mijozlar
- ✅ 2 kun qolgan to'lovlar
- ✅ HTML formatda chiroyli xabarlar
- ✅ Telefon raqam formatlash
- ✅ Pul miqdori formatlash
- ✅ Sana formatlash
- ✅ Xatoliklarni boshqarish

## Loglar

Bot ishlashi haqida loglar console da ko'rinadi:

```
Telegram bot xizmati boshlandi - har 5 minutda tekshiriladi
To'lov eslatmalari tekshirilmoqda...
Bugun 2 ta to'lov topildi
2 kun qolgan 1 ta to'lov topildi
Telegram xabar yuborildi: { ok: true, result: {...} }
Barcha eslatmalar yuborildi
```

## Xatoliklarni Hal Qilish

### Bot xabar yubormayapti
1. Internet aloqasini tekshiring
2. Bot token to'g'riligini tekshiring
3. Chat ID to'g'riligini tekshiring

### Mijozlar topilmayapti
1. MongoDB ulanishini tekshiring
2. Mijozlar ma'lumotlari to'g'riligini tekshiring
3. To'lov sanalarini tekshiring

### Server xatoliklari
1. Console loglarni tekshiring
2. .env fayl sozlamalarini tekshiring
3. Dependencies o'rnatilganligini tekshiring