# 🧪 Saqlash Funksiyasini Test Qilish

## Test 1: Kafil OFF (3 bosqich)

### Qadamlar:
1. Mijoz qo'shish tugmasini bosing
2. **Step 1:** Rasm yuklash (o'tkazib yuborish mumkin)
3. **Step 2:** Mijoz ma'lumotlari
   - Toggle OFF qiling (kafil yo'q)
   - Mijoz ismi: Test User
   - Telefon: 901234567
   - Boshqa ma'lumotlar (ixtiyoriy)
4. **Step 3:** Mahsulot ma'lumotlari
   - Mahsulot nomi: Divan
   - Asl narxi: 5000000
   - Ustama: 20%
   - Necha oyga: 12
5. **"Saqlash" tugmasini bosing**

### Kutilayotgan natija:
✅ Mijoz muvaffaqiyatli saqlanadi (kafil ma'lumotlari yo'q)

### Console loglar:
```
🚀 Form submitted!
🚀 Has guarantor: false
🚀 Form data: {customerName: "Test User", productName: "Divan", ...}
🚀 Current step: 3
📤 Sending customer data with images: []
📤 Has guarantor: false
✅ Mijoz muvaffaqiyatli yaratildi
```

---

## Test 2: Kafil ON (4 bosqich)

### Qadamlar:
1. Mijoz qo'shish tugmasini bosing
2. **Step 1:** Rasm yuklash (o'tkazib yuborish mumkin)
3. **Step 2:** Mijoz ma'lumotlari
   - Toggle ON qiling (kafil bor)
   - Mijoz ismi: Test User 2
   - Telefon: 901234568
   - Boshqa ma'lumotlar (ixtiyoriy)
4. **Step 3:** Kafil ma'lumotlari
   - Kafil ismi: Guarantor Name
   - Telefon: 901234569
   - Boshqa ma'lumotlar (ixtiyoriy)
5. **Step 4:** Mahsulot ma'lumotlari
   - Mahsulot nomi: Kreslo
   - Asl narxi: 3000000
   - Ustama: 15%
   - Necha oyga: 6
6. **"Saqlash" tugmasini bosing**

### Kutilayotgan natija:
✅ Mijoz muvaffaqiyatli saqlanadi (kafil ma'lumotlari bilan)

### Console loglar:
```
🚀 Form submitted!
🚀 Has guarantor: true
🚀 Form data: {customerName: "Test User 2", guarantorName: "Guarantor Name", productName: "Kreslo", ...}
🚀 Current step: 4
📤 Sending customer data with images: []
📤 Has guarantor: true
✅ Mijoz muvaffaqiyatli yaratildi
```

---

## ❌ Agar xatolik chiqsa:

### Xatolik 1: "Mijoz ismi va telefon raqami majburiy!"
**Sabab:** Mijoz ma'lumotlari to'ldirilmagan
**Yechim:** Step 2'da barcha majburiy maydonlarni to'ldiring

### Xatolik 2: "Mahsulot nomi va narxi majburiy!"
**Sabab:** Mahsulot ma'lumotlari to'ldirilmagan
**Yechim:** Mahsulot nomi va asl narxini kiriting

### Xatolik 3: "Kafil ismi va telefon raqami majburiy!"
**Sabab:** Toggle ON lekin kafil ma'lumotlari to'ldirilmagan
**Yechim:** Kafil ismi va telefon raqamini kiriting yoki toggle OFF qiling

### Xatolik 4: "Unexpected token '<', "<html>... is not valid JSON"
**Sabab:** Server xatolik qaytargan
**Yechim:** 
- Server ishlab turibmikan tekshiring
- Network tab'da request/response ko'ring
- Backend loglarni tekshiring

### Xatolik 5: "Server xatolik qaytardi. Status: 413"
**Sabab:** Rasm hajmi juda katta
**Yechim:** 
- Rasmlar avtomatik compress qilinadi
- Server'da limitlar oshirilganini tekshiring
- Nginx va PM2 restart qilinganini tekshiring

---

## 🔍 Debug qilish:

### Browser Console'ni ochish:
- **Chrome (Android):** Menu → More tools → Developer tools → Console
- **Safari (iOS):** Settings → Safari → Advanced → Web Inspector
- **Desktop:** F12 yoki Ctrl+Shift+I

### Network Tab'ni tekshirish:
1. F12 → Network tab
2. "Saqlash" tugmasini bosing
3. `/api/customers` request'ni toping
4. Request payload va Response'ni ko'ring

### Backend loglarni ko'rish:
```bash
pm2 logs ozodamebel --lines 50
```

---

## ✅ Muvaffaqiyatli saqlangandan keyin:

1. Modal yopiladi
2. Mijozlar ro'yxati yangilanadi
3. Yangi mijoz ro'yxatda ko'rinadi
4. Success notification ko'rsatiladi (agar bor bo'lsa)

---

**Test qilish sanasi:** 2026-02-07
**Status:** Test qilishga tayyor
