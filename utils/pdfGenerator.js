const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFGenerator {
  constructor() {
    this.doc = null;
  }

  // Shartnoma PDF yaratish
  async generateContract(contractData) {
    return new Promise((resolve, reject) => {
      try {
        this.doc = new PDFDocument({ 
          margin: 50,
          size: 'A4'
        });
        const filename = `contract-${contractData.contractNumber}.pdf`;
        const filepath = path.join('./uploads/contracts', filename);
        
        // Papkani yaratish
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        const stream = fs.createWriteStream(filepath);
        this.doc.pipe(stream);
        
        // PDF mazmuni - yangi format
        this.addNewContractContent(contractData);
        
        this.doc.end();
        
        stream.on('finish', () => {
          resolve(filename);
        });
        
        stream.on('error', reject);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Kafillik shartnomasi PDF
  async generateGuarantorAgreement(contractData) {
    return new Promise((resolve, reject) => {
      try {
        this.doc = new PDFDocument({ 
          margin: 50,
          size: 'A4'
        });
        const filename = `guarantor-${contractData.contractNumber}.pdf`;
        const filepath = path.join('./uploads/contracts', filename);
        
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        const stream = fs.createWriteStream(filepath);
        this.doc.pipe(stream);
        
        this.addNewGuarantorContent(contractData);
        
        this.doc.end();
        
        stream.on('finish', () => {
          resolve(filename);
        });
        
        stream.on('error', reject);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Yangi kafillik shartnomasi mazmuni - Ultra kompakt
  addNewGuarantorContent(data) {
    const { customer, guarantor, financial } = data;
    
    // Sana formatlash
    const contractDate = new Date(data.signDate || data.createdAt);
    const formattedDate = `${contractDate.getDate().toString().padStart(2, '0')}.${(contractDate.getMonth() + 1).toString().padStart(2, '0')}.${contractDate.getFullYear()}`;
    
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('KAFILLIK SHARTNOMASI', { align: 'center' })
      .moveDown(0.8);
    
    // Ma'lumotlarni ikki qatorga joylashtiramiz - Eng kichik
    const leftX = 50;
    const rightX = 320;
    const currentY = this.doc.y;
    
    this.doc
      .fontSize(8)
      .font('Helvetica')
      .text(`Sana: ${formattedDate}`, leftX, currentY, { width: 250, align: 'left' })
      .text(`Shahar: Toshkent`, rightX, currentY, { width: 230, align: 'left' });
    
    this.doc.y = currentY + 20;
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('KAFIL MAJBURIYATLARI', { underline: true })
      .moveDown(0.3)
      
      .fontSize(8)
      .font('Helvetica')
      .text(`Men, ${guarantor?.fullName || 'Noma\'lum'}, ${customer?.fullName || 'Noma\'lum'} ning ${(financial?.loanAmount || 0).toLocaleString()} so'm miqdoridagi qarzini to'lash bo'yicha kafil bo'lishga roziman.`)
      .moveDown(0.5)
      
      .fontSize(7)
      .text('Kafil sifatida men quyidagi majburiyatlarni olaman:')
      .text('1. Asosiy qarzchi majburiyatlarini bajarmaganida to\'lov qilish')
      .text('2. Qarzni muddatida to\'lash uchun qarzchini nazorat qilish')
      .text('3. Kompaniya bilan hamkorlik qilish')
      .text('4. Qarzchi bilan aloqani uzmaslik')
      .text('5. Manzil o\'zgarishi haqida xabar berish')
      .moveDown(0.6);
    
    // Ma'lumotlarni ikki ustunda joylashtiramiz - Eng kichik
    const infoY = this.doc.y;
    
    this.doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('KAFIL MA\'LUMOTLARI:', leftX, infoY)
      .fontSize(7)
      .font('Helvetica')
      .text(`F.I.SH: ${guarantor?.fullName || 'Noma\'lum'}`, leftX, infoY + 12)
      .text(`Telefon: ${guarantor?.contact?.primaryPhone || ''}`, leftX, infoY + 22)
      .text(`Ish joyi: ${guarantor?.workplace?.organization || ''}`, leftX, infoY + 32)
      
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('XARIDOR MA\'LUMOTLARI:', rightX, infoY)
      .fontSize(7)
      .font('Helvetica')
      .text(`F.I.SH: ${customer?.fullName || 'Noma\'lum'}`, rightX, infoY + 12)
      .text(`Telefon: ${customer?.contact?.primaryPhone || ''}`, rightX, infoY + 22)
      .text(`Qarz: ${(financial?.loanAmount || 0).toLocaleString()} so'm`, rightX, infoY + 32)
      .text(`Muddat: ${financial?.termMonths || 0} oy`, rightX, infoY + 42)
      .text(`Oylik: ${(financial?.monthlyPayment || 0).toLocaleString()} so'm`, rightX, infoY + 52);
    
    this.doc.y = infoY + 70;
    this.doc
      .moveDown(1.5)
      .fontSize(8)
      .text('Kafil: _____________                       Sana: ________')
      .moveDown(0.5)
      .text('Guvoh: _____________                      Sana: ________');
  }

  // To'lov jadvali PDF
  async generatePaymentSchedule(contractData) {
    return new Promise((resolve, reject) => {
      try {
        this.doc = new PDFDocument({ 
          margin: 50,
          size: 'A4'
        });
        const filename = `schedule-${contractData.contractNumber}.pdf`;
        const filepath = path.join('./uploads/contracts', filename);
        
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        const stream = fs.createWriteStream(filepath);
        this.doc.pipe(stream);
        
        this.addNewScheduleContent(contractData);
        
        this.doc.end();
        
        stream.on('finish', () => {
          resolve(filename);
        });
        
        stream.on('error', reject);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Yangi to'lov jadvali mazmuni
  addNewScheduleContent(data) {
    const { financial } = data;
    
    this.doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('TO\'LOV JADVALI', { align: 'center' })
      .moveDown(1.5);
    
    // Ma'lumotlarni ikki ustunda joylashtiramiz
    const leftX = 50;
    const rightX = 320;
    const currentY = this.doc.y;
    
    this.doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Mijoz: ${data.customer?.fullName || 'Noma\'lum'}`, leftX, currentY, { width: 250, align: 'left' })
      .text(`Umumiy qarz: ${(financial?.loanAmount || 0).toLocaleString()} so'm`, rightX, currentY, { width: 230, align: 'left' })
      .text(`Telefon: ${data.customer?.contact?.primaryPhone || ''}`, leftX, currentY + 20, { width: 250, align: 'left' })
      .text(`Muddat: ${financial?.termMonths || 0} oy`, rightX, currentY + 20, { width: 230, align: 'left' })
      .text(`Oylik to'lov: ${(financial?.monthlyPayment || 0).toLocaleString()} so'm`, leftX, currentY + 40, { width: 250, align: 'left' });
    
    this.doc.y = currentY + 70;
    this.doc.moveDown(0.5);

    // To'lov jadvalini yaratish
    this.addFullPaymentScheduleTable(data);
  }

  // To'liq to'lov jadvali
  addFullPaymentScheduleTable(data) {
    const { financial } = data;
    
    // Agar paymentSchedule mavjud bo'lmasa, uni yaratamiz
    let paymentSchedule = data.paymentSchedule;
    if (!paymentSchedule || paymentSchedule.length === 0) {
      paymentSchedule = this.generatePaymentSchedule(financial);
    }
    
    const tableTop = this.doc.y;
    const tableLeft = 50;
    
    // Jadval sarlavhasi
    const headers = ['№', 'To\'lov sanasi', 'Asosiy qarz', 'Foiz', 'Jami to\'lov', 'Qolgan qarz'];
    const colWidths = [30, 80, 70, 50, 70, 80];
    
    let currentX = tableLeft;
    
    // Sarlavha qatori
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      this.doc
        .rect(currentX, tableTop, colWidths[i], 20)
        .stroke()
        .text(header, currentX + 2, tableTop + 5, { 
          width: colWidths[i] - 4, 
          align: 'center' 
        });
      currentX += colWidths[i];
    });
    
    // Ma'lumotlar qatorlari
    this.doc
      .fontSize(8)
      .font('Helvetica');
    
    let remainingDebt = financial?.loanAmount || 0;
    const monthlyPayment = financial?.monthlyPayment || 0;
    const principalPerMonth = Math.floor(remainingDebt / paymentSchedule.length);
    
    paymentSchedule.forEach((payment, index) => {
      const rowY = tableTop + 20 + (index * 15);
      currentX = tableLeft;
      
      // Oxirgi to'lovda qolgan qarzni to'liq yopish
      const currentPrincipal = index === paymentSchedule.length - 1 ? remainingDebt : principalPerMonth;
      const currentInterest = monthlyPayment - currentPrincipal;
      
      const rowData = [
        (index + 1).toString(),
        payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('uz-UZ') : '',
        currentPrincipal.toLocaleString(),
        Math.max(0, currentInterest).toLocaleString(),
        monthlyPayment.toLocaleString(),
        Math.max(0, remainingDebt - currentPrincipal).toLocaleString()
      ];
      
      remainingDebt -= currentPrincipal;
      if (remainingDebt < 0) remainingDebt = 0;
      
      rowData.forEach((data, i) => {
        this.doc
          .rect(currentX, rowY, colWidths[i], 15)
          .stroke()
          .text(data, currentX + 2, rowY + 3, { 
            width: colWidths[i] - 4, 
            align: i === 1 ? 'center' : 'center'
          });
        currentX += colWidths[i];
      });
      
      // Sahifa tugaganda yangi sahifaga o'tish
      if (rowY > 700) {
        this.doc.addPage();
        return;
      }
    });
    
    this.doc.y = tableTop + 20 + (paymentSchedule.length * 15) + 10;
  }

  // Chiroyli ikki sahifali format - To'liq markazlashtirilgan sarlavhalar
  addNewContractContent(data) {
    const { customer, guarantor, product, financial } = data;
    
    // Sana formatlash
    const contractDate = new Date(data.signDate || data.createdAt);
    const formattedDate = `${contractDate.getDate().toString().padStart(2, '0')}.${(contractDate.getMonth() + 1).toString().padStart(2, '0')}.${contractDate.getFullYear()}`;
    
    // ===== BIRINCHI SAHIFA =====
    
    // 1. SHARTNOMA SARLAVHASI - To'liq markazda
    this.doc
      .fontSize(16)
      .font('Helvetica-Bold');
    
    // Sarlavhani aniq markazga joylash
    const titleText = 'TOVARNI NASIYAGA SOTISH SHARTNOMASI';
    const titleWidth = this.doc.widthOfString(titleText);
    const pageWidth = 595 - 100; // A4 width minus margins
    const titleX = 50 + (pageWidth - titleWidth) / 2;
    
    this.doc
      .text(titleText, titleX, this.doc.y, { underline: true })
      .moveDown(1.5); // Sarlavha va ma'lumotlar orasida ko'proq joy
    
    // Ma'lumotlarni ikki qatorga joylashtiramiz
    const leftX = 50;
    const rightX = 320;
    const currentY = this.doc.y;
    
    this.doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Sana: ${formattedDate}`, leftX, currentY)
      .text(`Shahar: Toshkent`, rightX, currentY)
      .text(`Sotuvchi: ${product?.creditProvider || 'Ozoda Mebel'}`, leftX, currentY + 15)
      .text(`Xaridor: ${customer?.fullName || 'Noma\'lum'}`, rightX, currentY + 15);
    
    this.doc.y = currentY + 35;
    this.doc
      .fontSize(9)
      .text(`Mazkur shartnoma ${formattedDate} sanada Toshkent shahrida ${product?.creditProvider || 'Ozoda Mebel'} (keyingi o'rinlarda "Sotuvchi") hamda ${customer?.fullName || 'Noma\'lum'} (keyingi o'rinlarda "Xaridor") o'rtasida tuzildi.`)
      .moveDown(2.0); // Kamaytirildi

    // 2. 1-BO'LIM. SHARTNOMA PREDMETI - To'liq markazda
    this.doc.fontSize(12).font('Helvetica-Bold');
    const section1Text = '1-BO\'LIM. SHARTNOMA PREDMETI';
    const section1Width = this.doc.widthOfString(section1Text);
    const section1X = 50 + (pageWidth - section1Width) / 2;
    
    this.doc
      .text(section1Text, section1X, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    // Matnni markazda
    this.doc
      .fontSize(9)
      .font('Helvetica');
    const productText = 'Sotuvchi Xaridorga quyidagi tovar(lar)ni nasiyaga sotadi:';
    const productWidth = this.doc.widthOfString(productText);
    const productX = 50 + (pageWidth - productWidth) / 2;
    
    this.doc
      .text(productText, productX, this.doc.y)
      .moveDown(0.6); // Kamaytirildi

    // Mahsulot jadvali
    this.addProductTable(data);
    
    // Jami summani markazda
    this.doc
      .moveDown(0.8) // Jadval va summa orasida bo'shliq
      .fontSize(11)
      .font('Helvetica-Bold');
    const totalText = `Jami summa: ${(financial?.totalPrice || 0).toLocaleString()} so'm`;
    const totalWidth = this.doc.widthOfString(totalText);
    const totalX = 50 + (pageWidth - totalWidth) / 2;
    
    this.doc
      .text(totalText, totalX, this.doc.y)
      .moveDown(2.5); // Kamaytirildi

    // 3. 2-BO'LIM. SHARTNOMA BAHOSI VA TO'LOV TARTIBI - To'liq markazda
    this.doc.fontSize(12).font('Helvetica-Bold');
    const section2Text = '2-BO\'LIM. SHARTNOMA BAHOSI VA TO\'LOV TARTIBI';
    const section2Width = this.doc.widthOfString(section2Text);
    const section2X = 50 + (pageWidth - section2Width) / 2;
    
    this.doc
      .text(section2Text, section2X, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    // Moliyaviy ma'lumotlarni jadval ko'rinishida
    this.addFinancialTable(data);
    
    // To'lov matnini markazda
    this.doc
      .moveDown(0.5) // Kamaytirildi
      .fontSize(10)
      .font('Helvetica');
    const paymentText = 'To\'lovlar quyidagi jadval asosida amalga oshiriladi:';
    const paymentWidth = this.doc.widthOfString(paymentText);
    const paymentX = 50 + (pageWidth - paymentWidth) / 2;
    
    this.doc
      .text(paymentText, paymentX, this.doc.y)
      .moveDown(0.8); // Kamaytirildi

    // Amortizatsiya jadvali
    this.addAmortizationTable(data);

    // Bo'limlar orasida kamaytirilgan joy - 2-bo'lim va 3-bo'lim orasida
    this.doc.moveDown(2.5); // Kamaytirildi

    // 4. 3-BO'LIM. TOMONLARNING MAJBURIYATLARI - To'liq markazda
    this.doc.fontSize(12).font('Helvetica-Bold');
    const section3Text = '3-BO\'LIM. TOMONLARNING MAJBURIYATLARI';
    const section3Width = this.doc.widthOfString(section3Text);
    const section3X = 50 + (pageWidth - section3Width) / 2;
    
    this.doc
      .text(section3Text, section3X, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    // Majburiyatlarni jadval ko'rinishida
    this.addObligationsTable(data);

    // Bo'limlar orasida kamaytirilgan joy
    this.doc.moveDown(1.5); // Kamaytirildi

    // ===== IKKINCHI SAHIFAGA O'TISH =====
    this.doc.addPage();

    // 5. 4-BO'LIM. KECHIKISH VA PENYA - To'liq markazda
    this.doc.fontSize(12).font('Helvetica-Bold');
    const section4Text = '4-BO\'LIM. KECHIKISH VA PENYA';
    const section4Width = this.doc.widthOfString(section4Text);
    const section4X = 50 + (pageWidth - section4Width) / 2;
    
    this.doc
      .text(section4Text, section4X, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    // Penya ma'lumotlarini jadval ko'rinishida
    this.addPenaltyTable(data);

    // Bo'limlar orasida kamaytirilgan joy
    this.doc.moveDown(1.2); // Kamaytirildi

    // 6. 5-BO'LIM. KAFIL MAJBURIYATLARI - To'liq markazda
    this.doc
      .moveDown(0.5)
      .fontSize(12)
      .font('Helvetica-Bold');
    const section5Text = '5-BO\'LIM. KAFIL MAJBURIYATLARI';
    const section5Width = this.doc.widthOfString(section5Text);
    const section5X = 50 + (pageWidth - section5Width) / 2;
    
    this.doc
      .text(section5Text, section5X, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    // Kafil ma'lumotlarini jadval ko'rinishida
    this.addGuarantorTable(data);

    // Bo'limlar orasida kamaytirilgan joy
    this.doc.moveDown(1.2); // Kamaytirildi

    // 7. 6-BO'LIM. NIZOLARNI HAL QILISH - To'liq markazda
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold');
    const section6Text = '6-BO\'LIM. NIZOLARNI HAL QILISH';
    const section6Width = this.doc.widthOfString(section6Text);
    const section6X = 50 + (pageWidth - section6Width) / 2;
    
    this.doc
      .text(section6Text, section6X, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    // Nizolar matnini markazda
    this.doc
      .fontSize(9)
      .font('Helvetica');
    const disputeText = 'Mazkur shartnoma yuzasidan kelib chiqadigan nizolar O\'zbekiston Respublikasi qonunchiligiga muvofiq hal etiladi.';
    const disputeWidth = this.doc.widthOfString(disputeText);
    const disputeX = 50 + (pageWidth - disputeWidth) / 2;
    
    this.doc
      .text(disputeText, disputeX, this.doc.y)
      .moveDown(1.0); // Kamaytirildi

    // 8. 7-BO'LIM. TOMONLARNING REKVIZITLARI - To'liq markazda
    this.addPartiesDetails(data);

    // 9. KOMPANIYA MA'LUMOTLARI VA IMZOLAR
    this.addCompanyDetailsAndSignatures();
  }

  // Mahsulot jadvali - Markazlashtirilgan va chiroyli
  addProductTable(data) {
    const { product, financial } = data;
    
    const tableTop = this.doc.y;
    const tableLeft = 70; // Markazga yaqinroq
    
    // Jadval sarlavhasi
    const headers = ['№', 'Tovar nomi', 'O\'lchov birligi', 'Narxi', 'Miqdori', 'Umumiy summa'];
    const colWidths = [25, 140, 70, 75, 40, 80];
    
    let currentX = tableLeft;
    
    // Sarlavha qatori
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      this.doc
        .rect(currentX, tableTop, colWidths[i], 22)
        .stroke()
        .text(header, currentX + 5, tableTop + 6, { 
          width: colWidths[i] - 10, 
          align: 'center' 
        });
      currentX += colWidths[i];
    });
    
    // Ma'lumotlar qatori
    const dataRow = tableTop + 22;
    currentX = tableLeft;
    
    this.doc
      .fontSize(8)
      .font('Helvetica');
    
    const rowData = [
      '1',
      product?.name || 'Noma\'lum mahsulot',
      'dona',
      (financial?.totalPrice || 0).toLocaleString(),
      '1',
      (financial?.totalPrice || 0).toLocaleString()
    ];
    
    rowData.forEach((data, i) => {
      this.doc
        .rect(currentX, dataRow, colWidths[i], 22)
        .stroke()
        .text(data, currentX + 5, dataRow + 6, { 
          width: colWidths[i] - 10, 
          align: i === 1 ? 'left' : 'center' 
        });
      currentX += colWidths[i];
    });
    
    this.doc.y = dataRow + 27;
  }

  // Majburiyatlar jadvali - Ixcham
  addObligationsTable(data) {
    const tableTop = this.doc.y;
    const tableLeft = 50;
    
    // Jadval sarlavhasi
    const headers = ['XARIDOR MAJBURIYATLARI', 'SOTUVCHI MAJBURIYATLARI'];
    const colWidths = [230, 230];
    
    let currentX = tableLeft;
    
    // Sarlavha qatori
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      this.doc
        .rect(currentX, tableTop, colWidths[i], 18)
        .stroke()
        .text(header, currentX + 5, tableTop + 4, { 
          width: colWidths[i] - 10, 
          align: 'center' 
        });
      currentX += colWidths[i];
    });
    
    // Ma'lumotlar qatorlari - Kamaytirildi
    const obligationsData = [
      ['To\'lovlarni belgilangan muddatlarda amalga oshirish', 'Tovarni belgilangan tartibda topshirish'],
      ['Tovarni ehtiyotkorlik bilan saqlash', 'Shartnoma shartlariga amal qilish'],
      ['Shartnoma shartlariga rioya qilish', 'Mijoz bilan halol muomala qilish']
    ];
    
    this.doc
      .fontSize(8)
      .font('Helvetica');
    
    obligationsData.forEach((rowData, rowIndex) => {
      const rowY = tableTop + 18 + (rowIndex * 18);
      currentX = tableLeft;
      
      rowData.forEach((data, colIndex) => {
        this.doc
          .rect(currentX, rowY, colWidths[colIndex], 18)
          .stroke()
          .text(data, currentX + 5, rowY + 4, { 
            width: colWidths[colIndex] - 10, 
            align: 'left'
          });
        currentX += colWidths[colIndex];
      });
    });
    
    this.doc.y = tableTop + 18 + (obligationsData.length * 18) + 15; // Ko'proq joy
  }

  // Penya ma'lumotlari jadvali - Ixcham
  addPenaltyTable(data) {
    const { financial } = data;
    
    const tableTop = this.doc.y;
    const tableLeft = 50;
    
    // Jadval sarlavhasi
    const headers = ['Holat', 'Shart', 'Natija'];
    const colWidths = [150, 150, 160];
    
    let currentX = tableLeft;
    
    // Sarlavha qatori
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      this.doc
        .rect(currentX, tableTop, colWidths[i], 18)
        .stroke()
        .text(header, currentX + 5, tableTop + 4, { 
          width: colWidths[i] - 10, 
          align: 'center' 
        });
      currentX += colWidths[i];
    });
    
    // Ma'lumotlar qatorlari
    const penaltyData = [
      ['To\'lov kechikishi', 'Har bir kechikkan kun uchun', `${(financial?.penaltyRate || 0.1) * 100}% penya`],
      ['3 kundan ortiq kechikish', 'Kechikish 3 kundan oshsa', 'Kafilga murojaat qilish']
    ];
    
    this.doc
      .fontSize(8)
      .font('Helvetica');
    
    penaltyData.forEach((rowData, rowIndex) => {
      const rowY = tableTop + 18 + (rowIndex * 18);
      currentX = tableLeft;
      
      rowData.forEach((data, colIndex) => {
        this.doc
          .rect(currentX, rowY, colWidths[colIndex], 18)
          .stroke()
          .text(data, currentX + 5, rowY + 4, { 
            width: colWidths[colIndex] - 10, 
            align: 'center'
          });
        currentX += colWidths[colIndex];
      });
    });
    
    this.doc.y = tableTop + 18 + (penaltyData.length * 18) + 5;
  }

  // Kafil ma'lumotlari jadvali - Ixcham
  addGuarantorTable(data) {
    const { customer, guarantor, financial } = data;
    
    const tableTop = this.doc.y;
    const tableLeft = 50;
    
    // Jadval sarlavhasi
    const headers = ['Kafil majburiyatlari', 'Tafsilot'];
    const colWidths = [200, 260];
    
    let currentX = tableLeft;
    
    // Sarlavha qatori
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      this.doc
        .rect(currentX, tableTop, colWidths[i], 18)
        .stroke()
        .text(header, currentX + 5, tableTop + 4, { 
          width: colWidths[i] - 10, 
          align: 'center' 
        });
      currentX += colWidths[i];
    });
    
    // Ma'lumotlar qatorlari - Kamaytirildi
    const guarantorData = [
      ['Kafil shaxsi', guarantor?.fullName || 'Noma\'lum'],
      ['Kafolat miqdori', `${(financial?.loanAmount || 0).toLocaleString()} so'm`],
      ['Asosiy majburiyat', 'Xaridor to\'lovni amalga oshirmaganida to\'lash']
    ];
    
    this.doc
      .fontSize(8)
      .font('Helvetica');
    
    guarantorData.forEach((rowData, rowIndex) => {
      const rowY = tableTop + 18 + (rowIndex * 16);
      currentX = tableLeft;
      
      rowData.forEach((data, colIndex) => {
        this.doc
          .rect(currentX, rowY, colWidths[colIndex], 16)
          .stroke()
          .text(data, currentX + 5, rowY + 3, { 
            width: colWidths[colIndex] - 10, 
            align: colIndex === 0 ? 'left' : 'left'
          });
        currentX += colWidths[colIndex];
      });
    });
    
    this.doc.y = tableTop + 18 + (guarantorData.length * 16) + 5;
  }

  // Moliyaviy ma'lumotlar jadvali - Markazlashtirilgan
  addFinancialTable(data) {
    const { financial } = data;
    
    const tableTop = this.doc.y;
    const tableLeft = 70; // Markazga yaqinroq
    
    // Jadval sarlavhasi
    const headers = ['Ma\'lumot turi', 'Miqdori (so\'m)', 'Izoh'];
    const colWidths = [180, 110, 120];
    
    let currentX = tableLeft;
    
    // Sarlavha qatori
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      this.doc
        .rect(currentX, tableTop, colWidths[i], 24)
        .stroke()
        .text(header, currentX + 8, tableTop + 7, { 
          width: colWidths[i] - 16, 
          align: 'center' 
        });
      currentX += colWidths[i];
    });
    
    // Ma'lumotlar qatorlari
    const financialData = [
      ['Tovarlarning umumiy qiymati', (financial?.totalPrice || 0).toLocaleString(), 'Asosiy narx'],
      ['Boshlang\'ich to\'lov', (financial?.downPayment || 0).toLocaleString(), 'Dastlabki to\'lov'],
      ['Qolgan qarz summasi', (financial?.loanAmount || 0).toLocaleString(), 'Nasiya miqdori'],
      ['To\'lov muddati', `${financial?.termMonths || 0} oy`, 'Umumiy muddat'],
      ['Oylik to\'lov miqdori', (financial?.monthlyPayment || 0).toLocaleString(), 'Har oylik to\'lov']
    ];
    
    this.doc
      .fontSize(9)
      .font('Helvetica');
    
    financialData.forEach((rowData, rowIndex) => {
      const rowY = tableTop + 24 + (rowIndex * 22);
      currentX = tableLeft;
      
      rowData.forEach((data, colIndex) => {
        this.doc
          .rect(currentX, rowY, colWidths[colIndex], 22)
          .stroke()
          .text(data, currentX + 8, rowY + 6, { 
            width: colWidths[colIndex] - 16, 
            align: colIndex === 0 ? 'left' : 'center'
          });
        currentX += colWidths[colIndex];
      });
    });
    
    this.doc.y = tableTop + 24 + (financialData.length * 22) + 10;
  }

  // Amortizatsiya jadvali - Markazlashtirilgan va chiroyli
  addAmortizationTable(data) {
    const { financial } = data;
    
    // Agar paymentSchedule mavjud bo'lmasa, uni yaratamiz
    let paymentSchedule = data.paymentSchedule;
    if (!paymentSchedule || paymentSchedule.length === 0) {
      paymentSchedule = this.generatePaymentSchedule(financial);
    }
    
    const tableTop = this.doc.y;
    const tableLeft = 90; // Markazga yaqinroq
    
    // Jadval sarlavhasi
    const headers = ['Oy', 'To\'lov sanasi', 'Oylik to\'lov', 'Qolgan qarz'];
    const colWidths = [35, 100, 85, 85];
    
    let currentX = tableLeft;
    
    // Sarlavha qatori
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      this.doc
        .rect(currentX, tableTop, colWidths[i], 20)
        .stroke()
        .text(header, currentX + 5, tableTop + 5, { 
          width: colWidths[i] - 10, 
          align: 'center' 
        });
      currentX += colWidths[i];
    });
    
    // Ma'lumotlar qatorlari (faqat birinchi 4 ta)
    this.doc
      .fontSize(8)
      .font('Helvetica');
    
    const displaySchedule = paymentSchedule.slice(0, 4); // Birinchi 4 ta ko'rsatamiz
    let remainingDebt = financial?.loanAmount || 0;
    
    displaySchedule.forEach((payment, index) => {
      const rowY = tableTop + 20 + (index * 20);
      currentX = tableLeft;
      
      const rowData = [
        (index + 1).toString(),
        payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('uz-UZ') : '',
        (financial?.monthlyPayment || 0).toLocaleString(),
        (remainingDebt - (financial?.monthlyPayment || 0)).toLocaleString()
      ];
      
      remainingDebt -= (financial?.monthlyPayment || 0);
      if (remainingDebt < 0) remainingDebt = 0;
      
      rowData.forEach((data, i) => {
        this.doc
          .rect(currentX, rowY, colWidths[i], 20)
          .stroke()
          .text(data, currentX + 5, rowY + 5, { 
            width: colWidths[i] - 10, 
            align: 'center' 
          });
        currentX += colWidths[i];
      });
    });
    
    // Agar ko'proq to'lovlar bo'lsa, "..." qo'shamiz
    if (paymentSchedule.length > 4) {
      const lastRowY = tableTop + 20 + (4 * 20);
      currentX = tableLeft;
      
      ['...', '...', '...', '...'].forEach((data, i) => {
        this.doc
          .rect(currentX, lastRowY, colWidths[i], 20)
          .stroke()
          .text(data, currentX + 5, lastRowY + 5, { 
            width: colWidths[i] - 10, 
            align: 'center' 
          });
        currentX += colWidths[i];
      });
      
      this.doc.y = lastRowY + 25;
    } else {
      this.doc.y = tableTop + 20 + (displaySchedule.length * 20) + 5;
    }
  }

  // Tomonlarning rekvizitlari - To'liq markazlashtirilgan sarlavha
  addPartiesDetails(data) {
    const { customer, guarantor, product } = data;
    
    // Sarlavhani aniq markazga joylash
    this.doc.fontSize(12).font('Helvetica-Bold');
    const pageWidth = 595 - 100; // A4 width minus margins
    const section7Text = '7-BO\'LIM. TOMONLARNING REKVIZITLARI';
    const section7Width = this.doc.widthOfString(section7Text);
    const section7X = 50 + (pageWidth - section7Width) / 2;
    
    this.doc
      .text(section7Text, section7X, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    // Rekvizitlarni ikki qatorga joylashtiramiz
    const leftX = 50;
    const rightX = 320;
    const currentY = this.doc.y;
    
    // Birinchi qator - Sotuvchi va Kafil
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('SOTUVCHI:', leftX, currentY)
      .text('KAFIL:', rightX, currentY)
      
      .fontSize(9)
      .font('Helvetica')
      .text(`Tashkilot: ${product?.creditProvider || 'Ozoda Mebel'}`, leftX, currentY + 15)
      .text(`F.I.Sh: ${guarantor?.fullName || 'Noma\'lum'}`, rightX, currentY + 15)
      
      .text(`Manzil: Toshkent shahar`, leftX, currentY + 30)
      .text(`Telefon: ${guarantor?.contact?.primaryPhone || ''}`, rightX, currentY + 30)
      
      .text(`Telefon: +998 90 123 45 67`, leftX, currentY + 45)
      .text(`Manzil: ${guarantor?.address?.region || ''}, ${guarantor?.address?.district || ''}`, rightX, currentY + 45);
    
    // Ikkinchi qator - Xaridor
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('XARIDOR:', leftX, currentY + 70)
      
      .fontSize(9)
      .font('Helvetica')
      .text(`F.I.Sh: ${customer?.fullName || 'Noma\'lum'}`, leftX, currentY + 85)
      .text(`Telefon: ${customer?.contact?.primaryPhone || ''}`, leftX, currentY + 100)
      .text(`Manzil: ${customer?.address?.region || ''}, ${customer?.address?.district || ''}`, leftX, currentY + 115);
    
    this.doc.y = currentY + 140;
    this.doc.moveDown(1.0); // Kamaytirildi
  }

  // Kompaniya ma'lumotlari va imzo qismi - To'liq markazlashtirilgan
  addCompanyDetailsAndSignatures() {
    this.doc.moveDown(0.3);
    
    // Kompaniya ma'lumotlari bo'limi - To'liq markazda
    this.doc.fontSize(11).font('Helvetica-Bold');
    const pageWidth = 595 - 100; // A4 width minus margins
    const companyText = 'TOMONLARNING YURIDIK MANZILI';
    const companyWidth = this.doc.widthOfString(companyText);
    const companyX = 50 + (pageWidth - companyWidth) / 2;
    
    this.doc
      .text(companyText, companyX, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    // "SOTUVCHI" bo'limi - To'liq markazda
    this.doc.fontSize(10).font('Helvetica-Bold');
    const sellerText = '«SOTUVCHI»';
    const sellerWidth = this.doc.widthOfString(sellerText);
    const sellerX = 50 + (pageWidth - sellerWidth) / 2;
    
    this.doc
      .text(sellerText, sellerX, this.doc.y)
      .moveDown(0.5); // Kamaytirildi
    
    // Kompaniya ma'lumotlari - jadval ko'rinishida
    const tableTop = this.doc.y;
    const tableLeft = 70;
    const tableWidth = 450;
    const tableHeight = 90;
    
    // Jadval ramkasi
    this.doc
      .rect(tableLeft, tableTop, tableWidth, tableHeight)
      .stroke();
    
    // Kompaniya ma'lumotlari
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text('«Obod ozoda fayz mebel» XK', tableLeft + 10, tableTop + 8)
      
      .fontSize(8)
      .font('Helvetica')
      .text('Manzil: Buxoro viloyat, Gijduvon tuman, Kumok KFJ, 1 uy', tableLeft + 10, tableTop + 22)
      .text('telefaks: 91 925 00 49', tableLeft + 10, tableTop + 35)
      .text('x/r: 20208000100731598001', tableLeft + 10, tableTop + 48)
      .text('bank: Toshkent sh.,TIF Milliy bank bosh ofisi', tableLeft + 10, tableTop + 61)
      .text('MFO: 00450', tableLeft + 10, tableTop + 74)
      .text('INN: 304 686 418', tableLeft + 250, tableTop + 74);
    
    this.doc.y = tableTop + tableHeight + 15;
    
    // Rahbar va Bug'alter imzolari
    const signatureY = this.doc.y;
    const leftSignX = 100;
    const rightSignX = 350;
    
    this.doc
      .fontSize(8)
      .font('Helvetica')
      .text('Rahbar:', leftSignX, signatureY)
      .text('O.O.Nasriyev', leftSignX + 45, signatureY)
      .text('(imzo)', leftSignX + 45, signatureY + 10)
      
      .text('Bug\'alter:', rightSignX, signatureY)
      .text('_____________', rightSignX + 55, signatureY)
      .text('(imzo)', rightSignX + 55, signatureY + 10);
    
    this.doc.y = signatureY + 25;
    
    // M.Y. va XUQUQSHUNOS qismi
    this.doc
      .fontSize(8)
      .text('M.Y.', leftSignX, this.doc.y)
      .text('XUQUQSHUNOS:', leftSignX + 180, this.doc.y)
      .text('_____________', leftSignX + 270, this.doc.y)
      .text('(imzo)', leftSignX + 270, this.doc.y + 10);
    
    this.doc.moveDown(1.0); // Kamaytirildi
    
    // Mijoz va Kafil imzolari - To'liq markazda
    this.doc.fontSize(11).font('Helvetica-Bold');
    const signText = 'IMZOLAR';
    const signWidth = this.doc.widthOfString(signText);
    const signX = 50 + (pageWidth - signWidth) / 2;
    
    this.doc
      .text(signText, signX, this.doc.y, { underline: true })
      .moveDown(0.5); // Kamaytirildi
    
    const clientSignY = this.doc.y;
    
    this.doc
      .fontSize(9)
      .font('Helvetica')
      .text('Xaridor: _____________', 100, clientSignY)
      .text('Sana: ________', 300, clientSignY)
      .text('Kafil: _____________', 100, clientSignY + 25)
      .text('Sana: ________', 300, clientSignY + 25);
  }



  // To'lov jadvalini yaratish
  generatePaymentSchedule(financial) {
    if (!financial) return [];
    
    const schedule = [];
    const monthlyPayment = financial.monthlyPayment || 0;
    const termMonths = financial.termMonths || 0;
    const loanAmount = financial.loanAmount || 0;
    const interestRate = financial.interestRate || 0;
    
    const startDate = new Date();
    
    for (let i = 0; i < termMonths; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      
      // Sodda hisoblash
      const principalAmount = Math.floor(loanAmount / termMonths);
      const interestAmount = monthlyPayment - principalAmount;
      
      schedule.push({
        installmentNumber: i + 1,
        dueDate: dueDate,
        principalAmount: principalAmount,
        interestAmount: Math.max(0, interestAmount),
        totalAmount: monthlyPayment,
        status: 'pending'
      });
    }
    
    return schedule;
  }
}

module.exports = PDFGenerator;