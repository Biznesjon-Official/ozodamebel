# Rasm yuklash muammosini debug qilish

## 1. Browser Console ni tekshiring
- F12 bosing
- Console tabiga o'ting
- Qanday xatoliklar ko'rsatilayotganini tekshiring

## 2. Network tabini tekshiring
- F12 > Network tab
- Mijoz qo'shganda `/api/upload` so'rovini toping
- Response ni tekshiring:
  - Status code 200 bo'lishi kerak
  - Response body da `file.url` yoki `filePath` bo'lishi kerak
  - URL `/uploads/profiles/file-xxx.jpg` formatida bo'lishi kerak

## 3. Server loglarini tekshiring
- Terminal da server loglarini ko'ring
- Rasm yuklanganda qanday log chiqayotganini tekshiring

## 4. Uploads papkasini tekshiring
- Loyiha root papkasida `uploads/profiles/` papkasi bor yoki yo'qligini tekshiring
- Rasm shu papkaga yuklangan yoki yo'qligini tekshiring

## 5. Rasm URL ni to'g'ridan-to'g'ri tekshiring
- Browser da quyidagi URL ni oching:
  `http://localhost:3008/uploads/profiles/file-xxx.jpg`
  (xxx o'rniga haqiqiy fayl nomini qo'ying)
- Agar rasm ochilmasa, server static files ni to'g'ri serve qilmayapti

## 6. Agar muammo davom etsa
- Browser cache ni tozalang (Ctrl+Shift+Delete)
- Service Worker ni unregister qiling:
  - F12 > Application > Service Workers
  - "Unregister" tugmasini bosing
- Sahifani yangilang (Ctrl+Shift+R)
