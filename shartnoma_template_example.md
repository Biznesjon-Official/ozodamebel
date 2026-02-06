# DINAMIK SHARTNOMA TEMPLATE - MIJOZ UCHUN

Bu template asosida mijoz ma'lumotlari bilan shartnoma yaratish uchun quyidagi o'zgaruvchilarni ishlatishingiz mumkin:

## Asosiy mijoz ma'lumotlari:
```
{{mijoz_ismi}} - Mijozning ismi
{{mijoz_familiyasi}} - Mijozning familiyasi  
{{mijoz_otasining_ismi}} - Mijozning otasining ismi
{{mijoz_smi}} - To'liq F.I.Sh (Familiya Ism Otasining ismi)
{{mijoz_telefoni}} - Mijozning telefon raqami
{{mijoz_manzili}} - Mijozning yashash manzili
{{mijoz_passport_seriyasi}} - Passport seriyasi va raqami
{{mijoz_passport_berilgan_joyi}} - Passport berilgan joy
{{mijoz_passport_berilgan_sanasi}} - Passport berilgan sana
```

## Mahsulot va narx ma'lumotlari:
```
{{mahsulot_nomi}} - Sotilayotgan mahsulot nomi
{{mahsulot_narxi}} - Mahsulotning umumiy narxi
{{jami_summa}} - Jami to'lanadigan summa (foiz bilan)
{{boshlangich_tolov}} - Dastlabki to'lov miqdori
{{qolgan_summa}} - Qolgan qarz summa
{{oylik_tolov}} - Oylik to'lov miqdori
{{muddat_oylarda}} - Necha oyga bo'lib to'lash
{{foiz_stavkasi}} - Foiz stavkasi
```

## Sana va vaqt:
```
{{sana_vaqt}} - Shartnoma tuzilgan sana
{{bugungi_sana}} - Bugungi sana
{{tugash_sanasi}} - Shartnoma tugash sanasi
```

## Sotuvchi ma'lumotlari:
```
{{sotuvchinig_ismi}} - Sotuvchi kompaniya nomi (default: "Obod ozoda fayz mebel")
```

## To'lov jadvali uchun:
```
{{tolov_jadvali}} - Oylik to'lovlar jadvali (HTML jadval formatida)
```

## Misol ishlatish:

Agar mijoz ma'lumotlari quyidagicha bo'lsa:
- Ism: Akmal
- Familiya: Karimov  
- Otasining ismi: Valijon o'g'li
- Telefon: +998901234567
- Manzil: Toshkent sh., Yunusobod tumani
- Mahsulot: Yotoq xonasi to'plami
- Narx: 5,000,000 so'm
- Muddat: 12 oy

Template quyidagicha to'ldiriladi:
```
{{mijoz_smi}} → "Karimov Akmal Valijon o'g'li"
{{mijoz_telefoni}} → "+998901234567"
{{mahsulot_nomi}} → "Yotoq xonasi to'plami"
{{mahsulot_narxi}} → "5,000,000"
```

Bu o'zgaruvchilarni backend kodda real ma'lumotlar bilan almashtirish orqali har bir mijoz uchun individual shartnoma yaratishingiz mumkin.