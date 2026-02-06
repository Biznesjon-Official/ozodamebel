import { useState, useEffect } from 'react';

const useSeason = () => {
  const [season, setSeason] = useState('spring');
  const [seasonIcon, setSeasonIcon] = useState('🌸');
  const [seasonName, setSeasonName] = useState('Bahor');

  useEffect(() => {
    const getCurrentSeason = () => {
      const now = new Date();
      const month = now.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
      
      if (month >= 12 || month <= 2) {
        return {
          season: 'winter',
          icon: '❄️',
          name: 'Qish'
        };
      } else if (month >= 3 && month <= 5) {
        return {
          season: 'spring',
          icon: '🌸',
          name: 'Bahor'
        };
      } else if (month >= 6 && month <= 8) {
        return {
          season: 'summer',
          icon: '☀️',
          name: 'Yoz'
        };
      } else {
        return {
          season: 'autumn',
          icon: '🍂',
          name: 'Kuz'
        };
      }
    };

    const currentSeason = getCurrentSeason();
    setSeason(currentSeason.season);
    setSeasonIcon(currentSeason.icon);
    setSeasonName(currentSeason.name);
  }, []);

  const getSeasonalColors = () => {
    switch (season) {
      case 'winter':
        return {
          primary: '#3b82f6',
          secondary: '#1e40af',
          accent: '#60a5fa',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
          sidebarGradient: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)'
        };
      case 'spring':
        return {
          primary: '#10b981',
          secondary: '#059669',
          accent: '#34d399',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          sidebarGradient: 'linear-gradient(180deg, #065f46 0%, #047857 100%)'
        };
      case 'summer':
        return {
          primary: '#f59e0b',
          secondary: '#d97706',
          accent: '#fbbf24',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          sidebarGradient: 'linear-gradient(180deg, #92400e 0%, #b45309 100%)'
        };
      case 'autumn':
        return {
          primary: '#dc2626',
          secondary: '#b91c1c',
          accent: '#f87171',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
          sidebarGradient: 'linear-gradient(180deg, #7f1d1d 0%, #991b1b 100%)'
        };
      default:
        return {
          primary: '#10b981',
          secondary: '#059669',
          accent: '#34d399',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          sidebarGradient: 'linear-gradient(180deg, #065f46 0%, #047857 100%)'
        };
    }
  };

  return {
    season,
    seasonIcon,
    seasonName,
    seasonalColors: getSeasonalColors()
  };
};

export default useSeason;