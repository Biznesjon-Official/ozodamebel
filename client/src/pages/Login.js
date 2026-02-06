import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Eye, EyeOff, Lock, User, LogIn, MessageCircle, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import useSeason from '../hooks/useSeason';
import SeasonalBackground from '../components/SeasonalBackground';
import SeasonalEffects from '../components/SeasonalEffects';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${props => {
    switch (props.$season) {
      case 'winter':
        return 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 50%, #81d4fa 100%)';
      case 'spring':
        return 'linear-gradient(135deg, #f1f8e9 0%, #c8e6c9 50%, #a5d6a7 100%)';
      case 'summer':
        return 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 50%, #ffe082 100%)';
      case 'autumn':
        return 'linear-gradient(135deg, #fff3e0 0%, #ffcc80 50%, #ffb74d 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }};
  position: relative;
  overflow: hidden;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: ${props => {
    switch (props.$season) {
      case 'winter': return '#1565c0';
      case 'spring': return '#2e7d32';
      case 'summer': return '#ef6c00';
      case 'autumn': return '#d84315';
      default: return 'white';
    }
  }};
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  .logo-image {
    width: 90px;
    height: 90px;
    border-radius: 20px;
    margin: 0 auto 20px auto;
    display: block;
    object-fit: cover;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    border: 3px solid rgba(255, 255, 255, 0.9);
  }
  
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  
  p {
    color: #7f8c8d;
    font-size: 16px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  &.error {
    border-color: #e74c3c;
  }
`;

const PhoneInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PhonePrefix = styled.span`
  position: absolute;
  left: 48px;
  color: #6c757d;
  font-size: 16px;
  z-index: 1;
  pointer-events: none;
`;

const PhoneInput = styled(Input)`
  padding-left: 88px !important;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #adb5bd;
  padding: 4px;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 14px;
  margin-top: 8px;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  margin-bottom: 16px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BotButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  
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
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(46, 204, 113, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover::before {
      left: -100%;
    }
  }
  
  .icon {
    animation: ${props => props.$loading ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const BotStatus = styled.div`
  text-align: center;
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  
  &.success {
    background: rgba(46, 204, 113, 0.1);
    color: #27ae60;
    border: 1px solid rgba(46, 204, 113, 0.3);
  }
  
  &.error {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    border: 1px solid rgba(231, 76, 60, 0.3);
  }
  
  &.info {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db;
    border: 1px solid rgba(52, 152, 219, 0.3);
  }
`;

const WelcomeText = styled.div`
  text-align: center;
  
  h2 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
    
    /* Winter hat for first O letter */
    ${props => props.$season === 'winter' && `
      &::before {
        content: '';
        position: absolute;
        top: 0px;
        left: -2px;
        width: 24px;
        height: 14px;
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        border-radius: 12px 12px 0 0;
        border: 3px solid #ffffff;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        animation: hatBounce 3s ease-in-out infinite;
        z-index: 2;
      }
      
      &::after {
        content: '';
        position: absolute;
        top: -4px;
        left: 18px;
        width: 8px;
        height: 8px;
        background: #ffffff;
        border-radius: 50%;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        animation: hatBounce 3s ease-in-out infinite;
        z-index: 3;
      }
      
      @keyframes hatBounce {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
    `}
  }
  
  p {
    font-size: 18px;
    opacity: 0.9;
    line-height: 1.6;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 40px;
  
  li {
    padding: 12px 0;
    font-size: 16px;
    opacity: 0.9;
    
    &:before {
      content: "✓";
      margin-right: 12px;
      color: #2ecc71;
      font-weight: bold;
    }
  }
`;

const Login = () => {
  const { login, loading } = useAuth();
  const { season } = useSeason();
  const [showPassword, setShowPassword] = useState(false);
  const [botLoading, setBotLoading] = useState(false);
  const [botStatus, setBotStatus] = useState(null);
  const [phoneValue, setPhoneValue] = useState('');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Register phone field for validation
  React.useEffect(() => {
    register('phone', { 
      required: 'Telefon raqam majburiy',
      pattern: {
        value: /^[0-9]{9}$/,
        message: 'Telefon raqam 9 ta raqamdan iborat bo\'lishi kerak'
      }
    });
  }, [register]);

  const onSubmit = async (data) => {
    await login(data);
  };

  // Phone number formatting function
  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 9 digits
    const limitedDigits = digits.slice(0, 9);
    
    // Format as XX XXX-XX-XX
    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else if (limitedDigits.length <= 5) {
      return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2)}`;
    } else if (limitedDigits.length <= 7) {
      return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2, 5)}-${limitedDigits.slice(5)}`;
    } else {
      return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2, 5)}-${limitedDigits.slice(5, 7)}-${limitedDigits.slice(7)}`;
    }
  };

  // Handle phone input change
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneValue(formatted);
    
    // Set the raw digits for form validation
    const rawDigits = formatted.replace(/\D/g, '');
    setValue('phone', rawDigits);
  };

  const handleStartBot = async () => {
    setBotLoading(true);
    setBotStatus(null);
    
    try {
      // To'g'ri bot username bilan Telegram botga o'tish
      const botUsername = 'Kreditsite_bot';
      const telegramUrl = `https://t.me/${botUsername}?start=login`;
      
      // Yangi oynada Telegram botni ochish
      window.open(telegramUrl, '_blank');
      
      setBotStatus({
        type: 'success',
        message: `✅ Telegram bot ochildi! @${botUsername} botga /start komandasi yuboring va keyin bu sahifaga qaytib login qiling.`
      });
      
    } catch (error) {
      setBotStatus({
        type: 'error',
        message: '❌ Telegram botni ochishda xatolik: ' + error.message
      });
    } finally {
      setBotLoading(false);
    }
  };

  return (
    <LoginContainer $season={season}>
      <SeasonalBackground isLogin={true} />
      <SeasonalEffects />
      
      <LeftSection $season={season}>
        <WelcomeText $season={season}>
          <h2>Ozoda Mebel</h2>
          <p>
            Mebel va maishiy texnika muddatli to'lov admin paneliga kirish uchun 
            telefon raqam va parolingizni kiriting.
          </p>
        </WelcomeText>
        
        <FeatureList>
          <li>Mijozlar va kafillarni boshqarish</li>
          <li>Avtomatik shartnoma generatsiyasi</li>
          <li>To'lovlarni monitoring qilish</li>
          <li>SMS va Telegram xabarlari</li>
        </FeatureList>
      </LeftSection>

      <RightSection>
        <LoginForm onSubmit={handleSubmit(onSubmit)}>
          <Logo>
            <img 
              src="/favicon.ico" 
              alt="Ozoda Mebel Logo"
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h1>Ozoda Mebel</h1>
            <p>Admin panelga kirish</p>
          </Logo>

          <FormGroup>
            <Label>Telefon raqam</Label>
            <PhoneInputWrapper>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <PhonePrefix>+998</PhonePrefix>
              <PhoneInput
                type="tel"
                placeholder="91 071-28-28"
                value={phoneValue}
                onChange={handlePhoneChange}
                className={errors.phone ? 'error' : ''}
              />
            </PhoneInputWrapper>
            {errors.phone && (
              <ErrorMessage>
                {errors.phone.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Parol</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Parolni kiriting"
                className={errors.password ? 'error' : ''}
                {...register('password', { 
                  required: 'Parol majburiy',
                  minLength: {
                    value: 6,
                    message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
                  }
                })}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && (
              <ErrorMessage>
                {errors.password.message}
              </ErrorMessage>
            )}
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? (
              <div>Yuklanmoqda...</div>
            ) : (
              <>
                <LogIn size={20} />
                Kirish
              </>
            )}
          </LoginButton>

          <BotButton 
            type="button" 
            onClick={handleStartBot} 
            disabled={botLoading}
            $loading={botLoading}
          >
            {botLoading ? (
              <>
                <MessageCircle size={18} className="icon" />
                Telegram ochilmoqda...
              </>
            ) : (
              <>
                <MessageCircle size={18} />
                Telegram Botga Start Bosish
              </>
            )}
          </BotButton>

          {botStatus && (
            <BotStatus className={botStatus.type}>
              {botStatus.message}
              {botStatus.type === 'info' && (botStatus.botUsername || botStatus.autoStartUrl) && (
                <div style={{ marginTop: '16px' }}>
                  <a 
                    href={botStatus.autoStartUrl || `https://t.me/${botStatus.botUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #0088cc, #006699)',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginRight: '8px',
                      boxShadow: '0 2px 8px rgba(0, 136, 204, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 136, 204, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(0, 136, 204, 0.3)';
                    }}
                  >
                    🚀 Botni Ishga Tushirish
                  </a>
                  <div style={{ marginTop: '8px', fontSize: '12px', opacity: '0.8' }}>
                    {botStatus.autoStartUrl ? 
                      'Tugma avtomatik /start yuboradi, keyin bu sahifaga qaytib tugmani qayta bosing' :
                      'Botga o\'tib /start buyrug\'ini yuboring, keyin bu tugmani qayta bosing'
                    }
                  </div>
                </div>
              )}
              {botStatus.type === 'info' && !botStatus.botUsername && !botStatus.autoStartUrl && (
                <div style={{ marginTop: '12px', fontSize: '12px', opacity: '0.8' }}>
                  💡 Bot konfiguratsiyasi uchun TELEGRAM_BOT_SETUP.md faylini ko'ring
                </div>
              )}
            </BotStatus>
          )}
        </LoginForm>
      </RightSection>
    </LoginContainer>
  );
};

export default Login;