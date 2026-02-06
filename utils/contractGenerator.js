/**
 * Contract generator utility
 * Generates contract documents in various formats
 */

const fs = require('fs');
const path = require('path');

// Simple contract generator functions
const contractGenerator = {
  /**
   * Generate markdown contract
   */
  generateMarkdownContract: (contractData) => {
    const { guarantor, product, financial, contractNumber, startDate, endDate } = contractData;
    
    return `
# KREDIT SHARTNOMASI

**Shartnoma raqami:** ${contractNumber}
**Sana:** ${new Date(startDate).toLocaleDateString('uz-UZ')}

## 1. TOMONLAR

**Kredit oluvchi:** ${contractData.customerName || 'Noma\'lum'}
**Passport:** ${contractData.passportSeries || ''} ${contractData.passportNumber || ''}
**Telefon:** ${contractData.phone || ''}

**Kafil:** ${guarantor?.fullName || 'Yo\'q'}
**Passport:** ${guarantor?.passport?.series} ${guarantor?.passport?.number}

## 2. KREDIT MA'LUMOTLARI

**Mahsulot:** ${product.name}
**To'liq narx:** ${financial.totalPrice} so'm
**Boshlang'ich to'lov:** ${financial.downPayment} so'm
**Kredit summasi:** ${financial.loanAmount} so'm
**Foiz stavkasi:** ${financial.interestRate}%
**Muddat:** ${financial.termMonths} oy
**Oylik to'lov:** ${financial.monthlyPayment} so'm

## 3. TO'LOV GRAFIKI

Har oy ${financial.monthlyPayment} so'mdan ${financial.termMonths} oy davomida to'lash lozim.

## 4. JAVOBGARLIK

Kafil kredit oluvchining barcha majburiyatlari uchun javob beradi.

---
Shartnoma tugash sanasi: ${new Date(endDate).toLocaleDateString('uz-UZ')}
    `;
  },

  /**
   * Generate Word document contract
   */
  generateWordContract: async (contractData) => {
    try {
      // Create a simple Word document
      const content = contractGenerator.generateMarkdownContract(contractData);
      
      // For now, return the markdown content
      // In a real implementation, you would use a proper Word template
      return {
        success: true,
        content: content,
        filename: `contract_${contractData.contractNumber}.docx`
      };
    } catch (error) {
      console.error('Error generating Word contract:', error);
      throw error;
    }
  },

  /**
   * Generate PDF contract
   */
  generatePDFContract: async (contractData) => {
    try {
      // For now, return the markdown content
      // In a real implementation, you would use a PDF library like PDFKit
      const content = contractGenerator.generateMarkdownContract(contractData);
      
      return {
        success: true,
        content: content,
        filename: `contract_${contractData.contractNumber}.pdf`
      };
    } catch (error) {
      console.error('Error generating PDF contract:', error);
      throw error;
    }
  }
};

module.exports = contractGenerator;
