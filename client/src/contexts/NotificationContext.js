import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      autoClose: true,
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  };

  const showError = (message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 7000, // Longer duration for errors
      ...options
    });
  };

  const showInfo = (message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;