import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 24px;
`;

const Message = styled.p`
  color: #7f8c8d;
  margin-bottom: 30px;
  line-height: 1.6;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
`;

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <ErrorContainer>
      <ErrorCard>
        <Title>Kutilmagan xatolik yuz berdi</Title>
        <Message>
          Kechirasiz, dasturda xatolik yuz berdi. 
          Sahifani yangilashga harakat qiling.
        </Message>
        <Button onClick={resetErrorBoundary}>
          Sahifani yangilash
        </Button>
      </ErrorCard>
    </ErrorContainer>
  );
};

export default ErrorFallback;