// O'zbekiston viloyatlari va tumanlari
export const regions = {
  "Toshkent": [
    "Bekobod", "Bo'stonliq", "Bo'ka", "Chinoz", "Qibray", "Oqqo'rg'on", 
    "Ohangaron", "Parkent", "Piskent", "Quyi Chirchiq", "Yuqori Chirchiq", 
    "O'rta Chirchiq", "Yangiyo'l", "Zangiota"
  ],
  "Toshkent shahri": [
    "Bektemir", "Chilonzor", "Mirobod", "Mirzo Ulug'bek", "Olmazor", 
    "Sergeli", "Shayxontohur", "Uchtepa", "Yakkasaroy", "Yashnobod", 
    "Yunusobod", "Yashnaobod"
  ],
  "Andijon": [
    "Andijon", "Asaka", "Baliqchi", "Bo'z", "Buloqboshi", "Izboskan", 
    "Jalaquduq", "Marhamat", "Oltinko'l", "Paxtaobod", "Qo'rg'ontepa", 
    "Shahrixon", "Ulug'nor", "Xo'jaobod"
  ],
  "Buxoro": [
    "Buxoro", "Alat", "G'ijduvon", "Jondor", "Kogon", "Olot", "Peshku", 
    "Qorako'l", "Qorovulbozor", "Romitan", "Shofirkon", "Vobkent"
  ],
  "Farg'ona": [
    "Farg'ona", "Beshariq", "Bog'dod", "Buvayda", "Dang'ara", "Farg'ona", 
    "Furqat", "O'zbekiston", "Qo'shtepa", "Quva", "Rishton", "So'x", 
    "Toshloq", "Uchko'prik", "Yozyovon"
  ],
  "Jizzax": [
    "Jizzax", "Arnasoy", "Baxtiyor", "Do'stlik", "Forish", "G'allaorol", 
    "Mirzacho'l", "Paxtakor", "Yangiobod", "Zafarobod", "Zarbdor", "Zomin"
  ],
  "Xorazm": [
    "Urganch", "Bog'ot", "Gurlan", "Hazorasp", "Xiva", "Qo'shko'pir", 
    "Shovot", "Tuproqqal'a", "Yangiariq", "Yangibozor"
  ],
  "Namangan": [
    "Namangan", "Chortoq", "Chust", "Kosonsoy", "Mingbuloq", 
    "Norin", "Pop", "To'raqo'rg'on", "Uchqo'rg'on", "Uychi", "Yangiqo'rg'on"
  ],
  "Navoiy": [
    "Navoiy", "Kanimex", "Karmana", "Qiziltepa", "Konimex", "Navbahor", 
    "Nurota", "Tomdi", "Uchquduq", "Xatirchi"
  ],
  "Qashqadaryo": [
    "Qarshi", "Chiroqchi", "Dehqonobod", "G'uzor", "Kasbi", "Kitob", 
    "Koson", "Mirishkor", "Muborak", "Nishon", "Qamashi", "Shahrisabz", 
    "Yakkabog'"
  ],
  "Qoraqalpog'iston": [
    "Nukus", "Amudaryo", "Beruniy", "Chimboy", "Ellikqal'a", "Kegeyli", 
    "Qanliko'l", "Qo'ng'irot", "Mo'ynoq", "Shumanay", "Taxtako'pir", 
    "To'rtko'l", "Xo'jayli"
  ],
  "Samarqand": [
    "Samarqand", "Bulungur", "Ishtixon", "Jomboy", "Kattaqo'rg'on", 
    "Narpay", "Nurobod", "Oqdaryo", "Payariq", "Pastdarg'om", "Qo'shrabot", 
    "Toyloq", "Urgut"
  ],
  "Sirdaryo": [
    "Guliston", "Boyovut", "Mirzaobod", "Oqoltin", "Sardoba", 
    "Sayxunobod", "Sirdaryo", "Xovos", "Yangiyer"
  ],
  "Surxondaryo": [
    "Termiz", "Angor", "Bandixon", "Boysun", "Denov", "Jarqo'rg'on", 
    "Qiziriq", "Qumqo'rg'on", "Muzrabot", "Oltinsoy", "Sariosiyo", 
    "Sherobod", "Sho'rchi", "Uzun"
  ]
};

// Viloyatlar ro'yxati
export const regionsList = Object.keys(regions);

// Tuman olish funksiyasi
export const getDistricts = (region) => {
  return regions[region] || [];
};