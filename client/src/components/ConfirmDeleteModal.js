import React from 'react';
import styled from 'styled-components';
import { AlertTriangle } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 24px 24px 16px 24px;
  text-align: center;
`;

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px auto;
  
  .icon {
    color: #dc2626;
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
`;

const Message = styled.p`
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0;
`;

const CustomerName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin: 8px 0;
`;

const ModalActions = styled.div`
  padding: 16px 24px 24px 24px;
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.cancel {
    background: #e9ecef;
    color: #495057;
    
    &:hover {
      background: #dee2e6;
    }
  }
  
  &.confirm {
    background: #dc2626;
    color: white;
    
    &:hover {
      background: #b91c1c;
    }
  }
`;

const ConfirmDeleteModal = ({ credit, onConfirm, onCancel }) => {
  if (!credit) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <IconContainer>
            <AlertTriangle size={32} className="icon" />
          </IconContainer>
          <Title>Kreditni o'chirish</Title>
          <Message>
            Haqiqatan ham quyidagi elementni o'chirmoqchimisiz?
          </Message>
          <CustomerName>{credit.name || 'Noma\'lum'}</CustomerName>
          <Message>
            <strong>{credit.product?.name || credit.description || 'Element'}</strong>
          </Message>
          <Message style={{ marginTop: '12px', fontSize: '12px', color: '#dc2626' }}>
            Bu amal qaytarib bo'lmaydi!
          </Message>
        </ModalHeader>
        
        <ModalActions>
          <Button className="cancel" onClick={onCancel}>
            Bekor qilish
          </Button>
          <Button className="confirm" onClick={onConfirm}>
            Ha, o'chirish
          </Button>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmDeleteModal;