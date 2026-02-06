import React from 'react';
import styled from 'styled-components';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  position: relative;
  max-width: 80vw;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    max-width: 90vw;
    max-height: 70vh;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 80vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
    
    @media (max-width: 768px) {
      max-height: 70vh;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
  
  &.prev {
    left: 20px;
    
    @media (max-width: 768px) {
      left: 10px;
      width: 40px;
      height: 40px;
    }
  }
  
  &.next {
    right: 20px;
    
    @media (max-width: 768px) {
      right: 10px;
      width: 40px;
      height: 40px;
    }
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    bottom: 10px;
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const ImageModal = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && onPrev && currentIndex > 0) {
      onPrev();
    } else if (e.key === 'ArrowRight' && onNext && currentIndex < images.length - 1) {
      onNext();
    }
  }, [onClose, onPrev, onNext, currentIndex, images.length]);

  React.useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Restore body scroll and remove event listener
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!images || images.length === 0) return null;

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <X size={window.innerWidth <= 768 ? 16 : 20} />
        </CloseButton>
        
        {images.length > 1 && (
          <>
            <NavigationButton 
              className="prev" 
              onClick={onPrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft size={window.innerWidth <= 768 ? 20 : 24} />
            </NavigationButton>
            
            <NavigationButton 
              className="next" 
              onClick={onNext}
              disabled={currentIndex === images.length - 1}
            >
              <ChevronRight size={window.innerWidth <= 768 ? 20 : 24} />
            </NavigationButton>
          </>
        )}
        
        <ImageContainer>
          <img 
            src={images[currentIndex]} 
            alt={`Rasm ${currentIndex + 1}`}
          />
        </ImageContainer>
        
        {images.length > 1 && (
          <ImageCounter>
            {currentIndex + 1} / {images.length}
          </ImageCounter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ImageModal;