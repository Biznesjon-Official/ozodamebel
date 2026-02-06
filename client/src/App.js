import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './contexts/AuthContext';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Debtors from './pages/Debtors';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Profile from './pages/Profile';
import Loader from './components/UI/Loader';
import Notification from './components/UI/Notification';
import GlobalRefreshIndicator from './components/UI/GlobalRefreshIndicator';
import SeasonalEffects from './components/SeasonalEffects';
import useSeason from './hooks/useSeason';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.$seasonalBackground || 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'};
  transition: background 0.5s ease;
  position: relative;
  overflow-x: hidden;
`;

const AppContent = () => {
  const { user, loading } = useAuth();
  const { notifications, removeNotification } = useNotification();
  const [showLoader, setShowLoader] = useState(true);
  const { season, seasonalColors } = useSeason();

  // Show loader for at least 3 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show loader while auth is loading or during initial load
  if (loading || showLoader) {
    return <Loader />;
  }

  return (
    <AppContainer $seasonalBackground={seasonalColors.background} className="App">
      {user && <SeasonalEffects season={season} />}
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" />} 
        />
        
        {user ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/customers" replace />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="debtors" element={<Debtors />} />
            <Route path="profile" element={<Profile />} />
            {/* API routes uchun redirect */}
            <Route path="api/*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
      
      {/* Global Notifications */}
      <Notification 
        notifications={notifications} 
        onClose={removeNotification} 
      />
      
      {/* Global Refresh Indicator */}
      <GlobalRefreshIndicator />
    </AppContainer>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;