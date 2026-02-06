import React, { useState } from 'react';
import styled from 'styled-components';
import { X, FileText, Download, Users } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #6c757d;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
    color: #dc3545;
  }
`;

const CustomerInfo = styled.div`
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid #3498db;
  
  h3 {
    margin: 0 0 8px 0;
    color: #2c3e50;
    font-size: 18px;
    font-weight: 600;
  }
  
  p {
    margin: 4px 0;
    color: #6c757d;
    font-size: 14px;
  }
`;

const ContractOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContractButton = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    border-color: #3498db;
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.15);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .customer-icon {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
  }
  
  .guarantor-icon {
    background: linear-gradient(135deg, #e67e22, #f39c12);
    color: white;
  }
  
  .content {
    flex: 1;
    
    h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }
    
    p {
      margin: 0;
      font-size: 14px;
      color: #6c757d;
    }
  }
  
  .loading {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #3498db;
    font-size: 14px;
    font-weight: 500;
  }
`;

const ContractModal = ({ 
  customer, 
  onClose, 
  onGenerateCustomerContract, 
  onGenerateGuarantorContract,
  customerContractLoading,
  guarantorContractLoading 
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <h2>
            <FileText size={24} />
            Shartnoma yaratish
          </h2>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <CustomerInfo>
          <h3>{customer.fullName}</h3>
          <p>📱 {customer.phone}</p>
          <p>🛋 {customer.product?.name || 'Mahsulot nomi ko\'rsatilmagan'}</p>
          <p>💰 Qolgan summa: {customer.creditInfo?.remainingAmount?.toLocaleString()} so'm</p>
        </CustomerInfo>

        <ContractOptions>
          <ContractButton
            onClick={() => onGenerateCustomerContract(customer)}
            disabled={customerContractLoading}
          >
            <div className="icon customer-icon">
              <FileText size={24} />
            </div>
            <div className="content">
              <h4>Mijoz shartnomasi</h4>
              <p>Mijoz bilan tuzilgan asosiy shartnoma</p>
            </div>
            {customerContractLoading && (
              <div className="loading">
                <Download size={16} />
                Yaratilmoqda...
              </div>
            )}
          </ContractButton>

          <ContractButton
            onClick={() => onGenerateGuarantorContract(customer)}
            disabled={guarantorContractLoading || !customer.guarantor}
          >
            <div className="icon guarantor-icon">
              <Users size={24} />
            </div>
            <div className="content">
              <h4>Kafillik shartnomasi</h4>
              <p>
                {customer.guarantor 
                  ? `Kafil: ${customer.guarantor.name}` 
                  : 'Kafil ma\'lumotlari mavjud emas'
                }
              </p>
            </div>
            {guarantorContractLoading && (
              <div className="loading">
                <Download size={16} />
                Yaratilmoqda...
              </div>
            )}
          </ContractButton>
        </ContractOptions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ContractModal;