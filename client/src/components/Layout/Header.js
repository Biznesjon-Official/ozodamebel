import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useSeason from '../../hooks/useSeason';

const HeaderContainer = styled.header`
  height: 65px;
  background: ${props => {
    switch (props.$season) {
      case 'winter':
        return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
      case 'spring':
        return 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)';
      case 'summer':
        return 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)';
      case 'autumn':
        return 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 50%, #fdba74 100%)';
      default:
        return 'white';
    }
  }};
  border-bottom: 2px solid ${props => {
    switch (props.$season) {
      case 'winter':
        return '#3b82f6';
      case 'spring':
        return '#10b981';
      case 'summer':
        return '#f59e0b';
      case 'autumn':
        return '#ef4444';
      default:
        return '#e9ecef';
    }
  }};
  border-top: 1px solid ${props => {
    switch (props.$season) {
      case 'winter':
        return 'rgba(59, 130, 246, 0.2)';
      case 'spring':
        return 'rgba(16, 185, 129, 0.2)';
      case 'summer':
        return 'rgba(245, 158, 11, 0.2)';
      case 'autumn':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(233, 236, 239, 0.2)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: fixed;
  top: 0;
  left: ${props => props.$sidebarCollapsed ? '80px' : '280px'};
  right: 0;
  z-index: 999;
  transition: left 0.3s ease;
  
  @media (max-width: 768px) {
    left: 0;
  }
  width: auto;
  max-width: none;
  overflow: hidden;
  box-sizing: border-box;
  flex-shrink: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
    switch (props.$season) {
      case 'winter':
        return 'linear-gradient(135deg, rgba(219, 234, 254, 0.3) 0%, rgba(147, 197, 253, 0.15) 100%)';
      case 'spring':
        return 'linear-gradient(135deg, rgba(240, 253, 244, 0.3) 0%, rgba(187, 247, 208, 0.15) 100%)';
      case 'summer':
        return 'linear-gradient(135deg, rgba(255, 251, 235, 0.3) 0%, rgba(254, 243, 199, 0.15) 100%)';
      case 'autumn':
        return 'linear-gradient(135deg, rgba(254, 242, 242, 0.3) 0%, rgba(254, 202, 202, 0.15) 100%)';
      default:
        return 'none';
    }
  }};
    pointer-events: none;
    border-radius: 0 0 8px 8px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => {
    switch (props.$season) {
      case 'winter':
        return 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)';
      case 'spring':
        return 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)';
      case 'summer':
        return 'linear-gradient(90deg, transparent 0%, #f59e0b 50%, transparent 100%)';
      case 'autumn':
        return 'linear-gradient(90deg, transparent 0%, #ef4444 50%, transparent 100%)';
      default:
        return 'linear-gradient(90deg, transparent 0%, #e9ecef 50%, transparent 100%)';
    }
  }};
    animation: borderGlow 3s ease-in-out infinite;
  }
  
  @keyframes borderGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;

const NavbarSeasonalEffects = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const LogoutButton = styled.button`
  padding: 10px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  position: relative;
  overflow: hidden;
  min-width: 40px;
  height: 40px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  span {
    display: none;
  }
`;

const LogoutModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const LogoutModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: ${props => props.$show ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(-20px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  
  .icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #fef3c7, #fbbf24);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px auto;
    color: #f59e0b;
  }
  
  .title {
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 12px;
  }
  
  .message {
    font-size: 16px;
    color: #6b7280;
    margin-bottom: 32px;
    line-height: 1.5;
  }
  
  .buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  
  .cancel-btn {
    padding: 12px 24px;
    background: #f3f4f6;
    color: #374151;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }
  }
  
  .confirm-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-1px);
    }
  }
`;

const Header = ({ sidebarCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { season } = useSeason();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [navbarParticles, setNavbarParticles] = useState([]);

  // Generate navbar particles
  useEffect(() => {
    const generateNavbarParticles = () => {
      const particles = [];
      const particleCount = 12;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 2,
          size: 12 + Math.random() * 8
        });
      }
      setNavbarParticles(particles);
    };

    generateNavbarParticles();
  }, [season]);

  const getNavbarParticleSymbol = () => {
    switch (season) {
      case 'winter': return ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
      case 'spring': return ['🌸', '🌺', '🌼'][Math.floor(Math.random() * 3)];
      case 'summer': return ['☀', '🌞', '⭐'][Math.floor(Math.random() * 3)];
      case 'autumn': return ['🍂', '🍁', '🍃'][Math.floor(Math.random() * 3)];
      default: return '❄';
    }
  };



  // Prevent body scroll when logout modal is open
  useEffect(() => {
    if (showLogoutModal) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showLogoutModal]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    } finally {
      setShowLogoutModal(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <HeaderContainer $season={season} $sidebarCollapsed={sidebarCollapsed}>
      <NavbarSeasonalEffects>
        {navbarParticles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: '8px',
              fontSize: `${particle.size}px`,
              animation: `navbarFloat ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
              opacity: 0.8,
              color: season === 'winter' ? '#1e40af' :
                season === 'spring' ? '#059669' :
                  season === 'summer' ? '#d97706' : '#dc2626',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
            }}
          >
            {getNavbarParticleSymbol()}
          </div>
        ))}
      </NavbarSeasonalEffects>

      <style>{`
        @keyframes navbarFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-12px) rotate(180deg); opacity: 1; }
        }
      `}</style>

      <LeftSection>
        {/* Kredit qo'shish tugmasi olib tashlandi */}
      </LeftSection>

      <RightSection>
        <LogoutButton onClick={handleLogoutClick}>
          <LogOut size={16} />
          <span>Chiqish</span>
        </LogoutButton>
      </RightSection>

      {/* Logout Confirmation Modal */}
      <LogoutModal $show={showLogoutModal} onClick={handleCancelLogout}>
        <LogoutModalContent $show={showLogoutModal} onClick={(e) => e.stopPropagation()}>
          <div className="icon">
            <AlertTriangle size={28} />
          </div>
          <div className="title">Tizimdan chiqish</div>
          <div className="message">
            Haqiqatan ham tizimdan chiqmoqchimisiz? Barcha saqlanmagan ma'lumotlar yo'qoladi.
          </div>
          <div className="buttons">
            <button className="cancel-btn" onClick={handleCancelLogout}>
              Bekor qilish
            </button>
            <button className="confirm-btn" onClick={handleLogout}>
              Ha, chiqish
            </button>
          </div>
        </LogoutModalContent>
      </LogoutModal>
    </HeaderContainer>
  );
};

export default Header;