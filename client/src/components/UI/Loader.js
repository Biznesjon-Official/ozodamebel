import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import useSeason from '../../hooks/useSeason';

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
`;

const wave = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
`;

const snowfall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

const petalfall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(180deg); opacity: 0; }
`;

const leaffall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  50% { transform: translateY(50vh) rotate(180deg); opacity: 0.8; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

const raindrop = keyframes`
  0% { transform: translateY(-100vh); opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://as2.ftcdn.net/v2/jpg/01/25/21/73/360_F_125217328_l5n1Fh3ma4x0ZE9AQu8IZK8DhPBspq2Q.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: white;
  overflow: hidden;
  
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
          return 'linear-gradient(45deg, rgba(33, 150, 243, 0.7) 0%, rgba(3, 169, 244, 0.6) 50%, rgba(0, 188, 212, 0.5) 100%)';
        case 'spring':
          return 'linear-gradient(45deg, rgba(76, 175, 80, 0.7) 0%, rgba(139, 195, 74, 0.6) 50%, rgba(156, 204, 101, 0.5) 100%)';
        case 'summer':
          return 'linear-gradient(45deg, rgba(255, 193, 7, 0.7) 0%, rgba(255, 152, 0, 0.6) 50%, rgba(255, 87, 34, 0.5) 100%)';
        case 'autumn':
          return 'linear-gradient(45deg, rgba(255, 87, 34, 0.7) 0%, rgba(244, 67, 54, 0.6) 50%, rgba(233, 30, 99, 0.5) 100%)';
        default:
          return 'linear-gradient(45deg, rgba(103, 58, 183, 0.8) 0%, rgba(63, 81, 181, 0.7) 50%, rgba(33, 150, 243, 0.6) 100%)';
      }
    }};
    backdrop-filter: blur(2px);
    z-index: -1;
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
  animation: ${fadeInUp} 1s ease-out;
`;

const LogoCircle = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 4px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  animation: ${bounce} 2s infinite;
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.3),
    0 5px 15px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
    z-index: -1;
    animation: ${rotate} 3s linear infinite;
  }
  
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &::after {
    content: '🪑';
    font-size: 48px;
    display: ${props => props.$hasImage ? 'none' : 'block'};
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  }
`;

const CompanyName = styled.h1`
  font-size: 42px;
  font-weight: 900;
  margin: 0 0 15px 0;
  text-align: center;
  letter-spacing: 4px;
  animation: ${fadeInUp} 1s ease-out 0.3s both;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.1);
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CompanySubtitle = styled.p`
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 50px 0;
  text-align: center;
  animation: ${fadeInUp} 1s ease-out 0.6s both;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 500;
  letter-spacing: 1px;
`;

const LoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeInUp} 1s ease-out 0.9s both;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  margin-bottom: 35px;
`;

const Spinner = styled.div`
  width: 70px;
  height: 70px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid rgba(255, 255, 255, 0.9);
  border-right: 5px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  box-shadow: 
    0 0 20px rgba(255, 255, 255, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
`;

const LoadingText = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
`;

const ProgressBarContainer = styled.div`
  width: 350px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 35px;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(255, 255, 255, 0.7) 50%, 
    rgba(255, 255, 255, 0.9) 100%);
  border-radius: 4px;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
  box-shadow: 
    0 0 10px rgba(255, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: ${rotate} 2s linear infinite;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const Dot = styled.div`
  width: 14px;
  height: 14px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
  animation-delay: ${props => props.$delay}s;
  box-shadow: 
    0 0 10px rgba(255, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
`;

const WaveContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 4px;
  opacity: 0.3;
`;

const SeasonalParticle = styled.div`
  position: absolute;
  pointer-events: none;
  font-size: ${props => props.$size}px;
  left: ${props => props.$left}%;
  animation-duration: ${props => props.$duration}s;
  animation-delay: ${props => props.$delay}s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-name: ${props => {
    switch (props.$season) {
      case 'winter': return snowfall;
      case 'spring': return petalfall;
      case 'summer': return raindrop;
      case 'autumn': return leaffall;
      default: return snowfall;
    }
  }};
  color: ${props => {
    switch (props.$season) {
      case 'winter': return '#1976d2';
      case 'spring': return '#e91e63';
      case 'summer': return '#2196f3';
      case 'autumn': return '#ff5722';
      default: return '#1976d2';
    }
  }};
  opacity: 0.7;
  z-index: 1;
`;

const WaveBar = styled.div`
  width: 6px;
  height: ${props => props.$height}px;
  background: ${props => {
    switch (props.$season) {
      case 'winter': return 'rgba(25, 118, 210, 0.6)';
      case 'spring': return 'rgba(46, 125, 50, 0.6)';
      case 'summer': return 'rgba(239, 108, 0, 0.6)';
      case 'autumn': return 'rgba(216, 67, 21, 0.6)';
      default: return 'rgba(255, 255, 255, 0.6)';
    }
  }};
  border-radius: 3px;
  animation: ${wave} 1s infinite;
  animation-delay: ${props => props.$delay}s;
`;

const Loader = () => {
  const { season } = useSeason();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Yuklanmoqda...');
  const [hasImage, setHasImage] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate seasonal particles
  useEffect(() => {
    const generateParticles = () => {
      const particleCount = 15;
      const newParticles = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 20 + 15,
          duration: Math.random() * 3 + 4,
          delay: Math.random() * 5
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [season]);

  const getParticleSymbol = () => {
    switch (season) {
      case 'winter': return ['❄', '❅', '❆', '🌨'][Math.floor(Math.random() * 4)];
      case 'spring': return ['🌸', '🌺', '🌼', '🌷'][Math.floor(Math.random() * 4)];
      case 'summer': return ['💧', '☀', '🌞'][Math.floor(Math.random() * 3)];
      case 'autumn': return ['🍂', '🍁', '🍃'][Math.floor(Math.random() * 3)];
      default: return '❄';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 10 + 2;
      });
    }, 200);

    const textInterval = setInterval(() => {
      const texts = [
        'Yuklanmoqda...',
        'Tizim ishga tushmoqda...',
        'Ma\'lumotlar yuklanmoqda...',
        'Deyarli tayyor...'
      ];
      setLoadingText(texts[Math.floor(Math.random() * texts.length)]);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  const waveBars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    height: Math.random() * 40 + 20,
    delay: i * 0.1
  }));

  return (
    <LoaderContainer $season={season}>
      {/* Seasonal Particles */}
      {particles.map(particle => (
        <SeasonalParticle
          key={particle.id}
          $season={season}
          $left={particle.left}
          $size={particle.size}
          $duration={particle.duration}
          $delay={particle.delay}
        >
          {getParticleSymbol()}
        </SeasonalParticle>
      ))}

      <LogoSection>
        <LogoCircle $hasImage={hasImage}>
          <img 
            src="/favicon.ico" 
            alt="Ozoda Mebel"
            onLoad={() => setHasImage(true)}
            onError={(e) => {
              e.target.style.display = 'none';
              setHasImage(false);
            }}
          />
        </LogoCircle>
        <CompanyName>OZODA MEBEL</CompanyName>
        <CompanySubtitle>Mebel va maishiy texnika</CompanySubtitle>
      </LogoSection>

      <LoadingSection>
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
        
        <LoadingText>{loadingText}</LoadingText>
        
        <ProgressBarContainer>
          <ProgressBarFill $progress={Math.min(progress, 100)} />
        </ProgressBarContainer>
        
        <DotsContainer>
          <Dot $delay={0} />
          <Dot $delay={0.2} />
          <Dot $delay={0.4} />
        </DotsContainer>
      </LoadingSection>

      <WaveContainer>
        {waveBars.map(bar => (
          <WaveBar
            key={bar.id}
            $season={season}
            $height={bar.height}
            $delay={bar.delay}
          />
        ))}
      </WaveContainer>
    </LoaderContainer>
  );
};

export default Loader;