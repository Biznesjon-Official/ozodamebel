import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Snow animation
const snowfall = keyframes`
  0% {
    transform: translateY(-100vh) translateX(0px);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(100px);
    opacity: 0;
  }
`;

// Rain animation
const rainfall = keyframes`
  0% {
    transform: translateY(-100vh) translateX(0px);
    opacity: 0.7;
  }
  100% {
    transform: translateY(100vh) translateX(-50px);
    opacity: 0;
  }
`;

// Leaves falling animation
const leaffall = keyframes`
  0% {
    transform: translateY(-100vh) translateX(0px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(200px) rotate(360deg);
    opacity: 0;
  }
`;

// Sakura petals animation
const petalfall = keyframes`
  0% {
    transform: translateY(-100vh) translateX(0px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(-100px) rotate(180deg);
    opacity: 0;
  }
`;

const WeatherContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const Snowflake = styled.div.attrs(props => ({
  style: {
    fontSize: `${props.$size}px`,
    animationDelay: `${props.$delay}s`,
    left: `${props.$left}%`
  }
}))`
  position: absolute;
  color: white;
  animation: ${snowfall} ${props => props.$duration}s linear infinite;
  opacity: 0.8;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const Raindrop = styled.div.attrs(props => ({
  style: {
    height: `${props.$length}px`,
    animationDelay: `${props.$delay}s`,
    left: `${props.$left}%`
  }
}))`
  position: absolute;
  width: 2px;
  background: linear-gradient(to bottom, rgba(174, 194, 224, 0.6), rgba(174, 194, 224, 0.3));
  animation: ${rainfall} ${props => props.$duration}s linear infinite;
  border-radius: 0 0 2px 2px;
`;

const Leaf = styled.div.attrs(props => ({
  style: {
    fontSize: `${props.$size}px`,
    animationDelay: `${props.$delay}s`,
    left: `${props.$left}%`
  }
}))`
  position: absolute;
  animation: ${leaffall} ${props => props.$duration}s linear infinite;
  opacity: 0.7;
`;

const Petal = styled.div.attrs(props => ({
  style: {
    fontSize: `${props.$size}px`,
    animationDelay: `${props.$delay}s`,
    left: `${props.$left}%`
  }
}))`
  position: absolute;
  color: #ffb3d9;
  animation: ${petalfall} ${props => props.$duration}s linear infinite;
  opacity: 0.8;
  text-shadow: 0 0 5px rgba(255, 179, 217, 0.3);
`;

const SeasonalEffects = ({ season }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = season === 'winter' ? 50 : season === 'spring' ? 30 : season === 'autumn' ? 40 : 60;
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 10,
          duration: season === 'winter' ? 8 + Math.random() * 4 : 
                   season === 'spring' ? 6 + Math.random() * 3 :
                   season === 'autumn' ? 7 + Math.random() * 3 : 
                   3 + Math.random() * 2,
          size: season === 'winter' ? 12 + Math.random() * 8 : 
                season === 'spring' ? 8 + Math.random() * 4 :
                season === 'autumn' ? 10 + Math.random() * 6 : 
                15 + Math.random() * 10,
          length: season === 'summer' ? 15 + Math.random() * 10 : null
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [season]);

  const getParticleSymbol = (season) => {
    switch (season) {
      case 'winter': return ['❄', '❅', '❆'][Math.floor(Math.random() * 3)];
      case 'spring': return ['🌸', '🌺', '🌼'][Math.floor(Math.random() * 3)];
      case 'autumn': return ['🍂', '🍁', '🍃'][Math.floor(Math.random() * 3)];
      default: return null;
    }
  };

  if (season === 'summer') {
    return (
      <WeatherContainer>
        {particles.map(particle => (
          <Raindrop
            key={particle.id}
            $left={particle.left}
            $delay={particle.delay}
            $duration={particle.duration}
            $length={particle.length}
          />
        ))}
      </WeatherContainer>
    );
  }

  return (
    <WeatherContainer>
      {particles.map(particle => {
        const symbol = getParticleSymbol(season);
        
        if (season === 'winter') {
          return (
            <Snowflake
              key={particle.id}
              $left={particle.left}
              $delay={particle.delay}
              $duration={particle.duration}
              $size={particle.size}
            >
              {symbol}
            </Snowflake>
          );
        }
        
        if (season === 'spring') {
          return (
            <Petal
              key={particle.id}
              $left={particle.left}
              $delay={particle.delay}
              $duration={particle.duration}
              $size={particle.size}
            >
              {symbol}
            </Petal>
          );
        }
        
        if (season === 'autumn') {
          return (
            <Leaf
              key={particle.id}
              $left={particle.left}
              $delay={particle.delay}
              $duration={particle.duration}
              $size={particle.size}
            >
              {symbol}
            </Leaf>
          );
        }
        
        return null;
      })}
    </WeatherContainer>
  );
};

export default SeasonalEffects;