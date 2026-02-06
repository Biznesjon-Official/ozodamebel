import styled, { keyframes, css } from 'styled-components';
import useSeason from '../hooks/useSeason';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const drift = keyframes`
  0% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(10px) translateY(-10px); }
  50% { transform: translateX(-5px) translateY(-20px); }
  75% { transform: translateX(-10px) translateY(-10px); }
  100% { transform: translateX(0px) translateY(0px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  opacity: ${props => props.$isLogin ? '0.15' : '0.08'};
  transition: opacity 0.5s ease;
  
  ${props => {
    switch (props.$season) {
      case 'winter':
        return `
          background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTg4fsvzg_i08DKYHKsU-MV6o7JEGFjSyLsA&s");
        `;
      case 'spring':
        return `
          background-image: url("https://media.istockphoto.com/id/1479451330/photo/beautiful-wide-format-background-image-on-spring-theme.webp?b=1&s=612x612&w=0&k=20&c=XRwmtnDx3Zi9OaU4nGz-syl1v7bla06gB8peaabKAE0=");
        `;
      case 'summer':
        return `
          background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi-O9OCjpI-7q-D_7cRbQ1AYOO-SBSbNi3zw&s");
        `;
      case 'autumn':
        return `
          background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRj0PHiNElJvdikBCM4C1SxY_7zTAfnBkN4g&s");
        `;
      default:
        return '';
    }
  }}
`;

const SeasonalDecorations = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const FloatingElement = styled.div.attrs(props => ({
  style: {
    fontSize: `${props.$size}px`,
    color: props.$color,
    opacity: props.$opacity,
    animationDelay: `${props.$delay}s`,
    left: `${props.$left}%`,
    top: `${props.$top}%`
  }
}))`
  position: absolute;
  ${props => {
    switch (props.$animation) {
      case 'float': 
        return css`animation: ${float} ${props.$duration}s ease-in-out infinite;`;
      case 'drift': 
        return css`animation: ${drift} ${props.$duration}s ease-in-out infinite;`;
      case 'sparkle': 
        return css`animation: ${sparkle} ${props.$duration}s ease-in-out infinite;`;
      default: 
        return css`animation: ${float} ${props.$duration}s ease-in-out infinite;`;
    }
  }}
`;

const SeasonalBackground = ({ isLogin = false }) => {
  const { season } = useSeason();

  const getFloatingElements = () => {
    const elements = [];
    const count = isLogin ? 8 : 5;
    
    for (let i = 0; i < count; i++) {
      let symbol, color, animation;
      
      switch (season) {
        case 'winter':
          symbol = ['❄', '❅', '❆', '🌨'][Math.floor(Math.random() * 4)];
          color = '#3b82f6';
          animation = 'float';
          break;
        case 'spring':
          symbol = ['🌸', '🌺', '🌼', '🦋'][Math.floor(Math.random() * 4)];
          color = '#10b981';
          animation = 'drift';
          break;
        case 'summer':
          symbol = ['☀', '🌞', '🌻', '🦋'][Math.floor(Math.random() * 4)];
          color = '#f59e0b';
          animation = 'sparkle';
          break;
        case 'autumn':
          symbol = ['🍂', '🍁', '🍃', '🌰'][Math.floor(Math.random() * 4)];
          color = '#ef4444';
          animation = 'drift';
          break;
        default:
          symbol = '✨';
          color = '#6366f1';
          animation = 'sparkle';
      }
      
      elements.push({
        id: i,
        symbol,
        color,
        animation,
        size: 16 + Math.random() * 12,
        opacity: 0.3 + Math.random() * 0.4,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        left: Math.random() * 100,
        top: 10 + Math.random() * 80
      });
    }
    
    return elements;
  };

  const floatingElements = getFloatingElements();

  return (
    <BackgroundContainer>
      <BackgroundImage $season={season} $isLogin={isLogin} />
      <SeasonalDecorations>
        {floatingElements.map(element => (
          <FloatingElement
            key={element.id}
            $size={element.size}
            $color={element.color}
            $opacity={element.opacity}
            $animation={element.animation}
            $duration={element.duration}
            $delay={element.delay}
            $left={element.left}
            $top={element.top}
          >
            {element.symbol}
          </FloatingElement>
        ))}
      </SeasonalDecorations>
    </BackgroundContainer>
  );
};

export default SeasonalBackground;