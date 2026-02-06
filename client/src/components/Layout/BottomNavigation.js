import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  User,
  Users,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useSeason from '../../hooks/useSeason';

const BottomNavContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${props => {
      switch (props.$season) {
        case 'winter':
          return 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)';
        case 'spring':
          return 'linear-gradient(135deg, #059669 0%, #047857 100%)';
        case 'summer':
          return 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
        case 'autumn':
          return 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
        default:
          return 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
      }
    }};
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 999;
    height: 70px;
    padding: 8px 0;
    backdrop-filter: blur(10px);
  }
`;

const NavItem = styled(NavLink)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 4px;
  border-radius: 12px;
  margin: 0 4px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: ${props => {
      switch (props.$season) {
        case 'winter': return '#60a5fa';
        case 'spring': return '#34d399';
        case 'summer': return '#fbbf24';
        case 'autumn': return '#f87171';
        default: return '#3498db';
      }
    }};
    border-radius: 0 0 3px 3px;
    transition: width 0.3s ease;
  }
  
  &.active {
    color: white;
    transform: translateY(-2px);
    
    &::before {
      width: 30px;
    }
    
    svg {
      transform: scale(1.1);
      color: ${props => {
        switch (props.$season) {
          case 'winter': return '#60a5fa';
          case 'spring': return '#34d399';
          case 'summer': return '#fbbf24';
          case 'autumn': return '#f87171';
          default: return '#3498db';
        }
      }};
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  svg {
    margin-bottom: 4px;
    transition: all 0.3s ease;
  }
  
  span {
    font-size: 10px;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
  }
`;

const BottomNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { season } = useSeason();

  const menuItems = [
    { path: '/customers', icon: Users, label: 'Mijozlar' },
    { path: '/debtors', icon: AlertTriangle, label: 'Qarzdorlar' },
  ];

  // Admin va auditor uchun qo'shimcha menu
  if (user?.role === 'admin' || user?.role === 'auditor') {
    menuItems.push({ path: '/profile', icon: User, label: 'Profil' });
  }

  return (
    <BottomNavContainer $season={season}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavItem
            key={item.path}
            to={item.path}
            $season={season}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </NavItem>
        );
      })}
    </BottomNavContainer>
  );
};

export default BottomNavigation;