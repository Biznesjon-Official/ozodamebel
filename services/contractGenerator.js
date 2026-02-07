const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');
const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType } = require('docx');
const Customer = require('../models/Customer');
const { formatPhoneNumber, formatCurrency, formatDate } = require('../utils/formatters');

class ContractGenerator {
  constructor() {
    this.customerTemplatePath = path.join(__dirname, '..', 'shartnoma.md');
    this.guarantorTemplatePath = path.join(__dirname, '..', 'kafillik.md');
  }

  // Customer template faylini o'qish
  readCustomerTemplate() {
    try {
      return fs.readFileSync(this.customerTemplatePath, 'utf8');
    } catch (error) {
      console.error('Customer template faylini o\'qishda xatolik:', error);
      throw new Error('Mijoz shartnoma template topilmadi');
    }
  }

  // Guarantor template faylini o'qish
  readGuarantorTemplate() {
    try {
      return fs.readFileSync(this.guarantorTemplatePath, 'utf8');
    } catch (error) {
      console.error('Guarantor template faylini o\'qishda xatolik:', error);
      throw new Error('Kafillik shartnoma template topilmadi');
    }
  }

  // Template faylini o'qish (backward compatibility)
  readTemplate() {
    return this.readCustomerTemplate();
  }

  // Kafil ma'lumotlarini template uchun tayyorlash
  prepareGuarantorData(customer) {
    const currentDate = new Date();
    
    return {
      // Sana va vaqt
      sana_vaqt: formatDate(currentDate),
      shartnoma_berilgan_sana: formatDate(currentDate),
      
      // Sotuvchi ma'lumotlari
      sotuvchinig_ismi: 'Obod ozoda fayz mebel',
      'Обод озода файз мебель» ХК': 'Обод озода файз мебель» ХК',
      
      // Mijoz ma'lumotlari
      mijozning_nomi: customer.fullName,
      'mijoz nomi': customer.fullName,
      mijoning_raqami: formatPhoneNumber(customer.phone),
      mijozning_manzili: customer.address || 'Manzil ko\'rsatilmagan',
      mijozning: customer.passportSeries || 'Passport ma\'lumoti yo\'q',
      
      // Kafil ma'lumotlari (to'g'ri field nomlarini ishlatish)
      kafil_ismi: customer.guarantor?.name || 'Kafil ma\'lumoti yo\'q',
      kafil_telefoni: formatPhoneNumber(customer.guarantor?.phone || ''),
      kafilning_raqami: formatPhoneNumber(customer.guarantor?.phone || ''),
      kafil_manzili: customer.guarantor?.address || 'Manzil ko\'rsatilmagan',
      kafilning_manzili: customer.guarantor?.address || 'Manzil ko\'rsatilmagan',
      kafil_passport_seriyasi: customer.guarantor?.passportSeries || 'Passport ma\'lumoti yo\'q',
      'kafilning _pasport_seriyasi': customer.guarantor?.passportSeries || 'Passport ma\'lumoti yo\'q',
      
      // Mahsulot ma'lumotlari
      mahsulotning_nomi: customer.product?.name || 'Mahsulot nomi ko\'rsatilmagan',
      jami_summa: formatCurrency(customer.product?.sellingPrice || customer.product?.totalPrice || 0),
      oylik_tolov: formatCurrency(customer.product?.monthlyPayment || 0),
      
      // Kredit ma'lumotlari
      kredit_muddati: customer.product?.installmentMonths || customer.creditInfo?.duration || 12
    };
  }
  prepareCustomerData(customer) {
    const currentDate = new Date();
    const startDate = customer.creditInfo?.startDate || currentDate;
    const monthlyPayment = customer.product?.monthlyPayment || 0;
    const installmentMonths = customer.product?.installmentMonths || 12;
    
    // Mahsulot jadvalini yaratish
    const productTable = this.generateProductTable(customer.product, installmentMonths, monthlyPayment);
    
    return {
      // Sana va vaqt
      sana_vaqt: formatDate(currentDate),
      
      // Sotuvchi ma'lumotlari
      sotuvchinig_ismi: 'Obod ozoda fayz mebel',
      
      // Mijoz ma'lumotlari
      mijozning_nomi: customer.fullName,
      mijoz_smi: customer.fullName,
      mijoz_telefoni: formatPhoneNumber(customer.phone),
      mijoz_manzili: customer.address || 'Manzil ko\'rsatilmagan',
      mijoz_passport_seriyasi: customer.passportSeries || 'Passport ma\'lumoti yo\'q',
      
      // Mahsulot ma'lumotlari
      mahsulotning_nomi: customer.product?.name || 'Mahsulot nomi ko\'rsatilmagan',
      jami_narxi: formatCurrency(customer.product?.totalPrice || customer.product?.sellingPrice || 0),
      jami_summa: formatCurrency(customer.product?.totalPrice || customer.product?.sellingPrice || 0),
      
      // Kredit ma'lumotlari
      oylik_tolov: formatCurrency(monthlyPayment),
      kredit_muddati: installmentMonths,
      
      // Qo'shimcha ma'lumotlar
      mahsulot_berilgan_joynomi: 'Buxoro viloyat, G\'ijduvon tuman',
      mahsulot__qaysi_sanada_berilgan: formatDate(customer.createdDate || currentDate),
      
      // Mijoz imzosi
      mijoz_ismi: customer.fullName,
      
      // Jadvallar
      mahsulot_jadvali: productTable
    };
  }

  // Mahsulot jadvalini yaratish funksiyasi
  generateProductTable(product, installmentMonths, monthlyPayment) {
    const productName = product?.name || 'Mahsulot nomi ko\'rsatilmagan';
    const totalPrice = product?.sellingPrice || 0;
    
    let tableRows = [];
    tableRows.push('| № | Товар номи | Сумма |');
    tableRows.push('|---|------------|-------|');
    
    // Har bir oy uchun qator yaratish
    for (let i = 1; i <= installmentMonths; i++) {
      const monthName = this.getMonthName(i);
      const rowProductName = `${productName} (${i}-ой)`;
      
      tableRows.push(`| ${i} | ${rowProductName} | ${formatCurrency(monthlyPayment)} |`);
    }
    
    // Jami qatori
    tableRows.push(`| **Жами:** | | **${formatCurrency(totalPrice)}** |`);
    
    return tableRows.join('\n');
  }

  // Oy nomini olish funksiyasi
  getMonthName(monthNumber) {
    const months = [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
    return months[(monthNumber - 1) % 12];
  }

  // Markdown matnini DOCX formatiga o'tkazish
  convertMarkdownToDocx(markdownText) {
    const lines = markdownText.split('\n');
    const paragraphs = [];
    let isInCenterDiv = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let trimmedLine = line.trim();
      
      // HTML taglarni tekshirish va olib tashlash
      if (trimmedLine.includes('<div align="center">')) {
        isInCenterDiv = true;
        trimmedLine = trimmedLine.replace(/<div align="center">/g, '');
        if (trimmedLine === '') continue;
      }
      
      if (trimmedLine.includes('</div>')) {
        isInCenterDiv = false;
        trimmedLine = trimmedLine.replace(/<\/div>/g, '');
        if (trimmedLine === '') continue;
      }
      
      // Boshqa HTML taglarni olib tashlash
      trimmedLine = trimmedLine.replace(/<br\s*\/?>/g, '');
      trimmedLine = trimmedLine.replace(/<\/?b>/g, '');
      trimmedLine = trimmedLine.replace(/<\/?strong>/g, '');
      
      // Separator chiziqlarni o'tkazib yuborish
      if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
        continue;
      }
      
      if (trimmedLine === '') {
        // Bo'sh qator
        paragraphs.push(new Paragraph({ text: '' }));
      } else if (trimmedLine.startsWith('#')) {
        // Sarlavha
        const level = (trimmedLine.match(/^#+/) || [''])[0].length;
        const text = trimmedLine.replace(/^#+\s*/, '');
        
        paragraphs.push(new Paragraph({
          text: text,
          heading: level === 1 ? HeadingLevel.HEADING_1 : 
                  level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
          alignment: AlignmentType.CENTER
        }));
      } else if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
        // Jadval qatori
        const tableRows = [];
        let currentRowIndex = i;
        
        // Jadval qatorlarini yig'ish
        while (currentRowIndex < lines.length && 
               lines[currentRowIndex].trim().startsWith('|') && 
               lines[currentRowIndex].trim().endsWith('|')) {
          
          const rowLine = lines[currentRowIndex].trim();
          
          // Separator qatorini o'tkazib yuborish (|---|---|)
          if (!rowLine.includes('---')) {
            const cells = rowLine.split('|')
              .slice(1, -1) // Birinchi va oxirgi bo'sh elementlarni olib tashlash
              .map(cell => cell.trim());
            
            tableRows.push(cells);
          }
          
          currentRowIndex++;
        }
        
        // Jadval yaratish
        if (tableRows.length > 0) {
          const tableRowElements = tableRows.map((row, rowIndex) => {
            const cells = row.map(cellText => {
              const isBold = cellText.includes('**');
              const cleanText = cellText.replace(/\*\*/g, '');
              
              return new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ 
                    text: cleanText, 
                    bold: isBold || rowIndex === 0 // Birinchi qator har doim bold
                  })],
                  alignment: AlignmentType.CENTER
                })],
                width: {
                  size: 100 / row.length,
                  type: WidthType.PERCENTAGE
                }
              });
            });
            
            return new TableRow({
              children: cells
            });
          });
          
          const table = new Table({
            rows: tableRowElements,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            }
          });
          
          paragraphs.push(table);
        }
        
        // Jadval tugagandan keyin indeksni yangilash
        i = currentRowIndex - 1;
        
      } else if (trimmedLine.includes('**') || trimmedLine.includes('<b>')) {
        // Bold matn - HTML taglarni tozalash
        let text = trimmedLine.replace(/\*\*(.*?)\*\*/g, '$1').replace(/<\/?b>/g, '').replace(/<\/?strong>/g, '');
        const isBold = trimmedLine.includes('**') || trimmedLine.includes('<b>') || trimmedLine.includes('<strong>');
        
        // Sarlavha yoki markaziy matnlarni aniqlash
        const isCenterText = isInCenterDiv || 
                           text.includes('ТОВАРНИ НАСИЯГА СОТИШ ШАРТНОМАСИ') || 
                           text.includes('KAFILLIK SHARTNOMASI') ||
                           text.includes('ШАРТНОМА ПРЕДМЕТИ') ||
                           text.includes('ТОМОНЛАРНИНГ РЕКВИЗИТ') ||
                           text.includes('ГРАФИК');
        
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: text, bold: isBold })],
          alignment: isCenterText ? AlignmentType.CENTER : AlignmentType.LEFT
        }));
      } else if (trimmedLine.includes('*Шартнома тугади*')) {
        // Oxirgi qator - o'rtaga
        paragraphs.push(new Paragraph({
          text: 'Шартнома тугади',
          alignment: AlignmentType.CENTER,
          italics: true
        }));
      } else {
        // Oddiy matn - sarlavhalarni o'rtaga joylashtirish
        const isTitle = isInCenterDiv ||
                       trimmedLine.match(/^\d+\.\s/) || 
                       trimmedLine.includes('ШАРТНОМА ПРЕДМЕТИ') ||
                       trimmedLine.includes('ТОМОНЛАРНИНГ РЕКВИЗИТ') ||
                       trimmedLine.includes('ГРАФИК') ||
                       trimmedLine.includes('ТАРАФЛАРНИНГ');
        
        paragraphs.push(new Paragraph({
          text: trimmedLine,
          alignment: isTitle ? AlignmentType.CENTER : AlignmentType.LEFT
        }));
      }
    }

    return paragraphs;
  }

  // Mijoz uchun shartnoma yaratish
  async generateCustomerContract(customerId) {
    try {
      // Mijoz ma'lumotlarini olish
      const customer = await Customer.findById(customerId)
        .populate('product')
        .populate('guarantor');

      if (!customer) {
        throw new Error('Mijoz topilmadi');
      }

      // Template o'qish
      const template = this.readCustomerTemplate();

      // Ma'lumotlarni tayyorlash
      const data = this.prepareCustomerData(customer);

      // Template'ni to'ldirish (HTML escape ni o'chirish)
      const filledTemplate = Mustache.render(template, data, {}, {
        escape: function(text) {
          return text; // HTML escape qilmaslik
        }
      });

      // DOCX yaratish
      const paragraphs = this.convertMarkdownToDocx(filledTemplate);

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      });

      // DOCX buffer yaratish
      const buffer = await Packer.toBuffer(doc);

      return {
        buffer: buffer,
        filename: `Shartnoma_${customer.fullName.replace(/\s+/g, '_')}_${Date.now()}.docx`,
        customer: customer
      };

    } catch (error) {
      console.error('Shartnoma yaratishda xatolik:', error);
      throw error;
    }
  }

  // Kafil uchun shartnoma yaratish
  async generateGuarantorContract(customerId) {
    try {
      // Mijoz ma'lumotlarini olish (kafil embedded document, populate shart emas)
      const customer = await Customer.findById(customerId);

      if (!customer) {
        throw new Error('Mijoz topilmadi');
      }

      if (!customer.guarantor || !customer.guarantor.name) {
        throw new Error('Kafil ma\'lumotlari topilmadi');
      }

      console.log('Kafil ma\'lumotlari mavjud:', customer.guarantor.name); // Debug uchun

      // Template o'qish
      const template = this.readGuarantorTemplate();

      // Ma'lumotlarni tayyorlash
      const data = this.prepareGuarantorData(customer);

      // Template'ni to'ldirish (HTML escape ni o'chirish)
      const filledTemplate = Mustache.render(template, data, {}, {
        escape: function(text) {
          return text; // HTML escape qilmaslik
        }
      });

      // DOCX yaratish
      const paragraphs = this.convertMarkdownToDocx(filledTemplate);

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs
        }]
      });

      // DOCX buffer yaratish
      const buffer = await Packer.toBuffer(doc);

      return {
        buffer: buffer,
        filename: `Kafillik_shartnomasi_${customer.fullName.replace(/\s+/g, '_')}_${Date.now()}.docx`,
        customer: customer,
        guarantor: customer.guarantor
      };

    } catch (error) {
      console.error('Kafillik shartnomasi yaratishda xatolik:', error);
      throw error;
    }
  }
}

module.exports = new ContractGenerator();