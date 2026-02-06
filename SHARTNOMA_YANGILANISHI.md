# SHARTNOMA TEMPLATE YANGILANISHI

## O'zgarishlar

### 1. Mahsulot jadvali (1.1 band) - DINAMIK
- Eski format: bitta qator (har doim)
- Yangi format: kredit muddatiga mos qatorlar

**Dinamik mahsulot jadvali:**
- 3 oy kredit → 3 ta mahsulot qatori
- 6 oy kredit → 6 ta mahsulot qatori  
- 12 oy kredit → 12 ta mahsulot qatori

**Misol (4 oylik):**
```
| № | Товар номи | Ўлчов бирлиги | Товар баҳоси | Миқдори | Сумма |
|---|------------|---------------|--------------|---------|-------|
| 1 | Bolalar xonasi mebeli (1-ой) | шт | 900 000 | 1.00 | 900 000 |
| 2 | Bolalar xonasi mebeli (2-ой) | шт | 900 000 | 1.00 | 900 000 |
| 3 | Bolalar xonasi mebeli (3-ой) | шт | 900 000 | 1.00 | 900 000 |
| 4 | Bolalar xonasi mebeli (4-ой) | шт | 900 000 | 1.00 | 900 000 |
| **Жами:** | | | | **4.00** | **3 600 000** |
```

### 2. TOMONLARNING REKVIZIT VA IMZOLARI
- Eski format: oddiy matn
- Yangi format: jadval ko'rinishida

### 3. DINAMIK TO'LOV JADVALI (GRAFIK)
- Eski format: 12 ta qator (har doim)
- Yangi format: mijozning kredit muddatiga mos qatorlar

### 4. KAFIL SHARTNOMASI TUZATILDI ✅
- **Muammo 1:** kafil ma'lumotlari olinmayotgan edi
- **Sabab:** `customer.guarantor.fullName` o'rniga `customer.guarantor.name` ishlatish kerak edi
- **Yechim:** `prepareGuarantorData()` funksiyasida to'g'ri field nomlari ishlatildi

- **Muammo 2:** Oxiridagi imzo qismi tartibsiz edi
- **Sabab:** Oddiy matn ko'rinishida edi, jadval emas
- **Yechim:** Imzo qismini jadval formatiga o'tkazildi

### 5. IMZO QISMI JADVAL TASHQARIDA ✅
- **Muammo:** Imzo chiziqlari jadval ichida edi
- **Sabab:** Imzo qismi jadval qatorlarida joylashgan edi
- **Yechim:** Imzo qismini jadvaldan tashqariga chiqarildi

**Yangi imzo formati (mijoz shartnomasi):**
```
| **СОТУВЧИ** | **СОТИБ ОЛУВЧИ** |
|-------------|------------------|
| Kompaniya ma'lumotlari | Mijoz ma'lumotlari |


**Компания имзоси:**                    **Мижоз имзоси:**

_____________________________          _____________________________

**Kompaniya nomi**                     **Mijoz ismi**
```

**Kafil shartnomasi uchun:**
```
| **СОТУВЧИ** | **ҚАРЗ ОЛУВЧИ** | **КАФИЛ** |
|-------------|-----------------|-----------|
| Kompaniya | Mijoz | Kafil |


**Компания имзоси:**    **Мижоз имзоси:**    **Кафил имзоси:**

________________       ________________      ________________

**Kompaniya**          **Mijoz**             **Kafil**
```

## Texnik o'zgarishlar

### services/contractGenerator.js
1. `generatePaymentSchedule()` - dinamik to'lov jadvali
2. `generateProductTable()` - yangi dinamik mahsulot jadvali
3. `prepareGuarantorData()` - kafil ma'lumotlari tuzatildi
4. `generateGuarantorContract()` - populate muammosi hal qilindi

### shartnoma.md
1. Mahsulot jadvali: `{{{mahsulot_jadvali}}}` template o'zgaruvchisi
2. To'lov jadvali: `{{{tolov_jadvali}}}` template o'zgaruvchisi
3. Rekvizitlar jadvali markdown formatida

## Test natijalari

✅ **Mijoz shartnomasi:**
- 3 oylik → 3 ta mahsulot qatori + 3 ta to'lov qatori
- 4 oylik → 4 ta mahsulot qatori + 4 ta to'lov qatori
- 6 oylik → 6 ta mahsulot qatori + 6 ta to'lov qatori

✅ **Kafil shartnomasi:**
- Kafil ma'lumotlari to'g'ri chiqadi
- Template o'zgaruvchilari to'ldiriladi
- Imzo qismi jadval tashqarida alohida
- DOCX fayl yaratiladi

✅ **Mijoz shartnomasi:**
- Dinamik mahsulot jadvali (muddat bo'yicha)
- Dinamik to'lov jadvali (muddat bo'yicha)
- Imzo qismi jadval tashqarida alohida
- DOCX fayl yaratiladi

## Yaratilgan fayllar

- `uploads/contracts/Kafillik_shartnomasi_*.docx` - kafil shartnomasi
- `uploads/contracts/Shartnoma_*.docx` - mijoz shartnomasi

Barcha muammolar hal qilindi va test qilindi! 🎉