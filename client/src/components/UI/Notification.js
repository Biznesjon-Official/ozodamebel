import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;

const NotificationItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 320px;
  max-width: 400px;
  animation: ${props => props.$isExiting ? slideOut : slideIn} 0.3s ease-out;
  pointer-events: all;
  position: relative;
  
  @media (max-width: 480px) {
    min-width: 280px;
    max-width: calc(100vw - 40px);
    margin: 0 20px;
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => {
    switch (props.$type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const Content = styled.div`
  flex: 1;
  
  .title {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 2px;
    font-size: 14px;
  }
  
  .message {
    color: #6b7280;
    font-size: 13px;
    line-height: 1.4;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    color: #6b7280;
    background: #f3f4f6;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: ${props => {
    switch (props.$type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  width: ${props => props.$progress}%;
  transition: width 0.1s linear;
  border-radius: 0 0 12px 0;
`;

const NotificationItemComponent = ({ notification, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification.autoClose !== false) {
      const duration = notification.duration || 5000;
      const interval = 50;
      const decrement = (interval / duration) * 100;

      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - decrement;
          if (newProgress <= 0) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return newProgress;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getTitle = () => {
    switch (notification.type) {
      case 'success':
        return 'Muvaffaqiyat';
      case 'error':
        return 'Xatolik';
      case 'info':
        return 'Ma\'lumot';
      default:
        return 'Bildirishnoma';
    }
  };

  return (
    <NotificationItem $type={notification.type} $isExiting={isExiting}>
      <IconWrapper $type={notification.type}>
        {getIcon()}
      </IconWrapper>
      <Content>
        <div className="title">{notification.title || getTitle()}</div>
        <div className="message">{notification.message}</div>
      </Content>
      <CloseButton onClick={handleClose}>
        <X size={16} />
      </CloseButton>
      {notification.autoClose !== false && (
        <ProgressBar $type={notification.type} $progress={progress} />
      )}
    </NotificationItem>
  );
};

const Notification = ({ notifications, onClose }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <NotificationContainer>
      {notifications.map(notification => (
        <NotificationItemComponent
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </NotificationContainer>
  );
};

export default Notification;