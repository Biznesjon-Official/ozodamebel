import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  X,
  User,
  Users,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useSeason from '../../hooks/useSeason';

const SidebarContainer = styled.div.attrs(props => ({
  style: {
    background: props.$seasonalColors?.sidebarGradient || 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
    '--before-bg': (() => {
      switch (props.$season) {
        case 'winter':
          return 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 197, 253, 0.1) 0%, transparent 50%)';
        case 'spring':
          return 'radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(52, 211, 153, 0.1) 0%, transparent 50%)';
        case 'summer':
          return 'radial-gradient(circle at 40% 60%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)';
        case 'autumn':
          return 'radial-gradient(circle at 25% 75%, rgba(220, 38, 38, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(248, 113, 113, 0.1) 0%, transparent 50%)';
        default:
          return 'none';
      }
    })()
  }
}))`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  
  @keyframes hatBounce {
    0%, 100% { transform: translateX(-50%) translateY(0px); }
    50% { transform: translateX(-50%) translateY(-2px); }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--before-bg);
    pointer-events: none;
  }
`;

const Logo = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  
  h2 {
    font-size: ${props => props.$collapsed ? '16px' : '24px'};
    margin: 0;
    color: #ecf0f1;
    font-weight: 600;
    font-style: italic;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    position: relative;
    display: inline-block;
  }
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    
    h2 {
      font-size: 20px;
    }
  }
`;

const SeasonalIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  animation: seasonalFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  
  @keyframes seasonalFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-5px) rotate(5deg); }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin: 2px 10px;
  border-radius: 8px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.6s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 60%;
    background: linear-gradient(135deg, #3498db, #2980b9);
    border-radius: 0 4px 4px 0;
    transition: width 0.3s ease;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ecf0f1;
    transform: translateX(4px) scale(1.01);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    &::before {
      left: 100%;
    }
    
    &::after {
      width: 4px;
    }
    
    svg {
      transform: scale(1.05) rotate(3deg);
      color: #3498db;
    }
    
    span {
      transform: translateX(1px);
    }
  }
  
  &.active {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    transform: translateX(2px);
    
    &::after {
      width: 4px;
      background: rgba(255, 255, 255, 0.8);
    }
    
    svg {
      color: white;
      transform: scale(1.02);
    }
  }
  
  svg {
    margin-right: ${props => props.$collapsed ? '0' : '12px'};
    min-width: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
  }
  
  span {
    font-weight: 500;
    font-size: 14px;
    display: ${props => props.$collapsed ? 'none' : 'block'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    &:hover {
      transform: translateX(2px) scale(1.005);
    }
  }
`;

const Sidebar = ({ collapsed, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { season, seasonIcon, seasonalColors } = useSeason();

  const menuItems = [
    { path: '/customers', icon: Users, label: 'Mijozlar' },
    { path: '/debtors', icon: AlertTriangle, label: 'Qarzdorlar' },
  ];

  // Admin va auditor uchun qo'shimcha menu
  if (user?.role === 'admin' || user?.role === 'auditor') {
    menuItems.push({ path: '/profile', icon: User, label: 'Profil' });
  }

  return (
    <SidebarContainer $season={season} $seasonalColors={seasonalColors}>
      <Logo $collapsed={collapsed} $season={season}>
        <h2>
          {season === 'winter' ? (
            <>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                O
                <span style={{
                  position: 'absolute',
                  top: '0px',
                  left: '45%',
                  transform: 'translateX(-50%)',
                  width: '18px',
                  height: '10px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  borderRadius: '9px 9px 0 0',
                  border: '2px solid #ffffff',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  animation: 'hatBounce 3s ease-in-out infinite'
                }}></span>
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '60%',
                  transform: 'translateX(-50%)',
                  width: '6px',
                  height: '6px',
                  background: '#ffffff',
                  borderRadius: '50%',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                  animation: 'hatBounce 3s ease-in-out infinite'
                }}></span>
              </span>
              <span style={{ display: collapsed ? 'none' : 'inline' }}>zoda Mebel</span>
            </>
          ) : (
            <>
              <span>O</span>
              <span style={{ display: collapsed ? 'none' : 'inline' }}>zoda Mebel</span>
            </>
          )}
        </h2>
        <SeasonalIcon>{seasonIcon}</SeasonalIcon>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
      </Logo>
      
      <Navigation>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavItem
              key={item.path}
              to={item.path}
              $collapsed={collapsed}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavItem>
          );
        })}
      </Navigation>
    </SidebarContainer>
  );
};

export default Sidebar;