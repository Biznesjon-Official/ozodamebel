import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const SidebarContainer = styled.div`
  width: ${props => props.$collapsed ? '80px' : '280px'};
  transition: width 0.3s ease;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  position: fixed;
  height: 100vh;
  z-index: 998;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    display: none; /* Mobilda sidebar yo'q */
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => props.$collapsed ? '80px' : '280px'};
  transition: margin-left 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding-bottom: 80px; /* Bottom navigation uchun joy */
  }
`;

const ContentArea = styled.main`
  min-height: 100vh;
  padding-top: 65px; /* Account for fixed header height */
  
  @media (max-width: 768px) {
    padding-top: 60px;
    min-height: calc(100vh - 140px); /* Header va bottom nav uchun */
  }
`;

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <LayoutContainer>
      <SidebarContainer $collapsed={sidebarCollapsed}>
        <Sidebar collapsed={sidebarCollapsed} />
      </SidebarContainer>
      
      <MainContent $collapsed={sidebarCollapsed}>
        <Header 
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <ContentArea>
          <Outlet />
        </ContentArea>
        
        {/* Mobile bottom navigation */}
        <BottomNavigation />
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;