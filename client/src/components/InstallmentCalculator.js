import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { X, Calculator, DollarSign, Calendar, TrendingUp, Percent } from 'lucide-react';
import { formatCurrency, formatCurrencyInput, parseCurrency } from '../utils/formatters';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    max-width: 95%;
    border-radius: 20px;
  }
`;

const ModalHeader = styled.div`
  padding: 28px 32px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: pulse 3s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 24px;
    gap: 12px;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  flex: 1;
  overflow-y: auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(226, 232, 240, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.3) 0%, transparent 100%);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .icon {
    color: #3b82f6;
  }
`;

const Input = styled.input`
  padding: 14px 18px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: white;
  color: #1e293b;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
  
  /* Prevent scroll on number input */
  &[type="number"] {
    -moz-appearance: textfield;
  }
  
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ToggleButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  padding: 4px;
  background: rgba(226, 232, 240, 0.3);
  border-radius: 12px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent'};
  cursor: pointer;
  font-weight: ${props => props.$active ? '700' : '600'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'};
  
  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(59, 130, 246, 0.1)'};
    color: ${props => props.$active ? 'white' : '#3b82f6'};
  }
`;

const ResultsSection = styled.div`
  margin-top: 32px;
  animation: ${slideUp} 0.5s ease;
`;

const SummaryCard = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
`;

const SummaryItem = styled.div`
  flex: 1;
  min-width: 150px;
  
  .label {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 16px;
    color: #1e293b;
    font-weight: 700;
  }
`;

const PaymentScheduleTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  th, td {
    padding: 16px;
    text-align: left;
  }
  
  th {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  tbody tr {
    transition: all 0.3s ease;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.05));
    }
    
    &.total-row {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
      font-weight: 700;
      
      td {
        font-weight: 700;
        color: #1e293b;
        border-top: 2px solid #3b82f6;
      }
    }
  }
  
  td {
    color: #475569;
    font-weight: 500;
    
    &:last-child {
      color: #1e293b;
      font-weight: 700;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  
  .icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  p {
    font-size: 16px;
    font-weight: 500;
  }
`;

const InstallmentCalculator = ({ onClose }) => {
  const [productName, setProductName] = useState('');
  const [originalPriceValue, setOriginalPriceValue] = useState('');
  const [markupType, setMarkupType] = useState('percent');
  const [profitPercentage, setProfitPercentage] = useState('');
  const [markupAmountValue, setMarkupAmountValue] = useState('');
  const [initialPaymentValue, setInitialPaymentValue] = useState('');
  const [installmentMonths, setInstallmentMonths] = useState('');

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const originalPrice = parseCurrency(originalPriceValue) || 0;
  const markupAmount = markupType === 'percent' 
    ? (originalPrice * (parseFloat(profitPercentage) || 0) / 100)
    : parseCurrency(markupAmountValue) || 0;
  const sellingPrice = originalPrice + markupAmount;
  const initialPayment = parseCurrency(initialPaymentValue) || 0;
  const remainingAmount = sellingPrice - initialPayment;
  const months = parseInt(installmentMonths) || 0;
  const monthlyPayment = months > 0 ? remainingAmount / months : 0;

  // Generate payment schedule
  const generatePaymentSchedule = () => {
    if (months === 0) return [];
    
    const schedule = [];
    const today = new Date();
    const displayName = productName || 'Mahsulot';
    
    for (let i = 0; i < months; i++) {
      const paymentDate = new Date(today);
      paymentDate.setMonth(paymentDate.getMonth() + i + 1);
      
      schedule.push({
        number: i + 1,
        productName: `${displayName} (${i + 1}-oy)`,
        date: paymentDate.toLocaleDateString('ru-RU', { 
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        amount: monthlyPayment
      });
    }
    
    return schedule;
  };

  const paymentSchedule = generatePaymentSchedule();
  const hasResults = originalPrice > 0 && markupAmount >= 0 && months > 0;
  const totalAmount = monthlyPayment * months;

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <Calculator size={28} />
            Nasiya kalkulyatori
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <SectionTitle>
            <DollarSign size={20} />
            Mahsulot ma'lumotlari
          </SectionTitle>
          
          <FormGrid>
            <FormGroup>
              <Label>
                Mahsulot nomi
              </Label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Masalan: Iphone 17, kreslo"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <DollarSign size={16} className="icon" />
                Asl narxi (so'm) *
              </Label>
              <Input
                value={originalPriceValue}
                onChange={(e) => setOriginalPriceValue(formatCurrencyInput(e.target.value))}
                placeholder="Masalan: 1,000,000"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <TrendingUp size={16} className="icon" />
                Ustama turi *
              </Label>
              <ToggleButtons>
                <ToggleButton
                  type="button"
                  $active={markupType === 'percent'}
                  onClick={() => setMarkupType('percent')}
                >
                  <Percent size={16} /> Foizda
                </ToggleButton>
                <ToggleButton
                  type="button"
                  $active={markupType === 'amount'}
                  onClick={() => setMarkupType('amount')}
                >
                  <DollarSign size={16} /> So'mda
                </ToggleButton>
              </ToggleButtons>
              
              {markupType === 'percent' ? (
                <Input
                  type="number"
                  value={profitPercentage}
                  onChange={(e) => setProfitPercentage(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  placeholder="Masalan: 20"
                />
              ) : (
                <Input
                  value={markupAmountValue}
                  onChange={(e) => setMarkupAmountValue(formatCurrencyInput(e.target.value))}
                  placeholder="Masalan: 200,000"
                />
              )}
            </FormGroup>

            <FormGroup>
              <Label>
                <DollarSign size={16} className="icon" />
                Boshlang'ich to'lov (so'm)
              </Label>
              <Input
                value={initialPaymentValue}
                onChange={(e) => setInitialPaymentValue(formatCurrencyInput(e.target.value))}
                placeholder="Masalan: 500,000"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Calendar size={16} className="icon" />
                Necha oyga *
              </Label>
              <Input
                type="number"
                value={installmentMonths}
                onChange={(e) => setInstallmentMonths(e.target.value)}
                onWheel={(e) => e.target.blur()}
                placeholder="Masalan: 12"
                min="1"
              />
            </FormGroup>
          </FormGrid>

          {hasResults && (
            <ResultsSection>
              <SummaryCard>
                <SummaryItem>
                  <div className="label">Asl narx</div>
                  <div className="value">{formatCurrency(originalPrice)} so'm</div>
                </SummaryItem>
                <SummaryItem>
                  <div className="label">Ustama</div>
                  <div className="value">{formatCurrency(markupAmount)} so'm</div>
                </SummaryItem>
                {initialPayment > 0 && (
                  <SummaryItem>
                    <div className="label">Boshlang'ich to'lov</div>
                    <div className="value">{formatCurrency(initialPayment)} so'm</div>
                  </SummaryItem>
                )}
                <SummaryItem>
                  <div className="label">Necha oyga</div>
                  <div className="value">{months} oy</div>
                </SummaryItem>
              </SummaryCard>

              {paymentSchedule.length > 0 && (
                <>
                  <SectionTitle>
                    <Calendar size={20} />
                    Oylik to'lov jadvali
                  </SectionTitle>
                  <PaymentScheduleTable>
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>Sana</th>
                        <th>Tovar nomi</th>
                        <th>Summa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentSchedule.map((payment) => (
                        <tr key={payment.number}>
                          <td>{payment.number}</td>
                          <td>{payment.date}</td>
                          <td>{payment.productName}</td>
                          <td>{formatCurrency(payment.amount)} so'm</td>
                        </tr>
                      ))}
                      <tr className="total-row">
                        <td colSpan="3">Jami:</td>
                        <td>{formatCurrency(totalAmount)} so'm</td>
                      </tr>
                    </tbody>
                  </PaymentScheduleTable>
                </>
              )}
            </ResultsSection>
          )}
          
          {!hasResults && (
            <EmptyState>
              <div className="icon">
                <Calculator size={64} />
              </div>
              <p>Ma'lumotlarni kiriting va natijalarni ko'ring</p>
            </EmptyState>
          )}
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default InstallmentCalculator;
