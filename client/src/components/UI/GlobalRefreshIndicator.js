import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { RefreshCw } from 'lucide-react';
import useGlobalData from '../../hooks/useGlobalData';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const IndicatorContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 
    0 8px 25px rgba(16, 185, 129, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  z-index: 1001;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${props => props.$show ? fadeIn : fadeOut} 0.3s ease-in-out;
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  
  .icon {
    animation: ${spin} 1s linear infinite;
    color: rgba(255, 255, 255, 0.9);
  }
  
  @media (max-width: 768px) {
    top: 70px;
    right: 16px;
    padding: 10px 14px;
    font-size: 13px;
  }
`;

const GlobalRefreshIndicator = () => {
  const { registerRefreshListener } = useGlobalData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const unregister = registerRefreshListener((refreshing) => {
      setIsRefreshing(refreshing);
    });
    
    return unregister;
  }, [registerRefreshListener]);

  return (
    <IndicatorContainer $show={isRefreshing}>
      <RefreshCw size={16} className="icon" />
      Ma'lumotlar yangilanmoqda...
    </IndicatorContainer>
  );
};

export default GlobalRefreshIndicator;