import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  AlertTriangle,
  Clock,
  MessageSquare,
  Calendar,
  Phone,
  Users,
  MapPin,
  Eye
} from 'lucide-react';
import apiService from '../services/api';
import { formatPhoneNumber, formatCurrency, formatDate } from '../utils/formatters';
import { useNotification } from '../contexts/NotificationContext';

const PageContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #dc2626;
    margin: 0;
  }
  
  .icon {
    color: #dc2626;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 12px 20px;
  border: 2px solid ${props => props.$active ? '#dc2626' : '#e9ecef'};
  background: ${props => props.$active ? '#dc2626' : 'white'};
  color: ${props => props.$active ? 'white' : '#6c757d'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    border-color: #dc2626;
    color: ${props => props.$active ? 'white' : '#dc2626'};
  }
  
  .count {
    background: ${props => props.$active ? 'rgba(255,255,255,0.2)' : '#f8f9fa'};
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
  }
`;

const DebtorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DebtorCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.$overdueDays >= 3 ? '#dc2626' : '#f59e0b'};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const DebtorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const DebtorInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 8px 0;
  }
  
  .overdue-badge {
    background: ${props => props.$overdueDays >= 3 ? '#dc2626' : '#f59e0b'};
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.sms {
    border-color: #10b981;
    color: #10b981;
    
    &:hover {
      background: #10b981;
      color: white;
    }
  }
  
  &.view {
    border-color: #3b82f6;
    color: #3b82f6;
    
    &:hover {
      background: #3b82f6;
      color: white;
    }
  }
`;

const DebtorDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6c757d;
  
  .icon {
    color: #9ca3af;
    flex-shrink: 0;
  }
  
  .value {
    color: #374151;
    font-weight: 500;
  }
`;

const PaymentInfo = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  
  .payment-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
      font-weight: 600;
      color: #dc2626;
      border-top: 1px solid #e9ecef;
      padding-top: 8px;
    }
  }
  
  .label {
    color: #6c757d;
    font-size: 14px;
  }
  
  .value {
    color: #374151;
    font-weight: 500;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  
  .icon {
    margin-bottom: 16px;
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: #374151;
  }
  
  p {
    margin: 0;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 18px;
  color: #6c757d;
`;

const Debtors = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [activeTab, setActiveTab] = useState('1day');
  const [overdue1Day, setOverdue1Day] = useState([]);
  const [overdue3Days, setOverdue3Days] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDebtors = useCallback(async () => {
    try {
      setLoading(true);
      
      const [response1Day, response3Days] = await Promise.all([
        apiService.getCustomersOverdue1Day(),
        apiService.getCustomersOverdue3Days()
      ]);

      if (response1Day && response1Day.success) {
        setOverdue1Day(response1Day.customers || []);
      } else {
        setOverdue1Day([]);
      }
      
      if (response3Days && response3Days.success) {
        setOverdue3Days(response3Days.customers || []);
      } else {
        setOverdue3Days([]);
      }
    } catch (error) {
      console.error('Error loading debtors:', error);
      setOverdue1Day([]);
      setOverdue3Days([]);
      
      if (error.message && error.message.includes('Token')) {
        showError('Iltimos qayta login qiling');
      } else {
        showError('Qarzdorlar ma\'lumotini yuklashda xatolik');
      }
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadDebtors();
  }, [loadDebtors]);

  const handleSendSMS = (customer, isGuarantor = false) => {
    let phoneNumber, message;
    
    if (isGuarantor) {
      // Kafil uchun SMS (3 kun kechikkan)
      phoneNumber = customer.guarantor?.phone;
      message = `Siz kafillik qilgan ${customer.fullName} ning to'lov sanasi 3 kun kechikdi iltimos eslatib qo'ying to'lovni o'z vaqtida to'lasinlar Ozoda mebel`;
      
      if (!phoneNumber) {
        showError('Kafil telefon raqami topilmadi');
        console.error('Kafil telefon raqami yo\'q:', customer.guarantor);
        return;
      }
    } else {
      // Mijoz uchun SMS (1 kun kechikkan)
      message = `Sizning to'lov sanangiz 1 kun kechikdi iltimos to'lovni o'z vaqtida to'lang Ozoda mebel`;
      phoneNumber = customer.phone;
    }
    
    if (phoneNumber) {
      // Format phone number for SMS (remove all non-digits first)
      let cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Add +998 if not present
      if (cleanPhone.startsWith('998')) {
        cleanPhone = '+' + cleanPhone;
      } else if (cleanPhone.startsWith('9')) {
        cleanPhone = '+998' + cleanPhone;
      } else {
        cleanPhone = '+998' + cleanPhone;
      }
      
      // Create SMS URL
      const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
      
      // Create temporary link element and click it
      const link = document.createElement('a');
      link.href = smsUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess(`SMS ilovasi ochildi: ${cleanPhone} ${isGuarantor ? '(Kafil)' : '(Mijoz)'}`);
    } else {
      showError('Telefon raqam topilmadi');
    }
  };

  const handleViewCustomer = (customer) => {
    navigate(`/customers/${customer._id}`);
  };

  const getCurrentDebtors = () => {
    return activeTab === '1day' ? overdue1Day : overdue3Days;
  };

  const getOverdueDays = (customer) => {
    const today = new Date();
    const paymentDate = new Date(customer.creditInfo?.nextPaymentDate);
    return Math.ceil((today - paymentDate) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Yuklanmoqda...</LoadingSpinner>
      </PageContainer>
    );
  }

  const currentDebtors = getCurrentDebtors();

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <AlertTriangle className="icon" size={32} />
          <h1>Qarzdorlar</h1>
        </PageTitle>
      </PageHeader>

      <TabsContainer>
        <Tab 
          $active={activeTab === '1day'} 
          onClick={() => setActiveTab('1day')}
        >
          <Clock size={16} />
          1 kun kechikkan
          <span className="count">{overdue1Day.length}</span>
        </Tab>
        <Tab 
          $active={activeTab === '3days'} 
          onClick={() => setActiveTab('3days')}
        >
          <AlertTriangle size={16} />
          3+ kun kechikkan
          <span className="count">{overdue3Days.length}</span>
        </Tab>
      </TabsContainer>

      {currentDebtors.length === 0 ? (
        <EmptyState>
          <Clock className="icon" size={64} color="#6c757d" />
          <h3>
            {activeTab === '1day' ? '1 kun kechikkan' : '3+ kun kechikkan'} mijozlar yo'q
          </h3>
          <p>Hozircha bu kategoriyada qarzdor mijozlar mavjud emas</p>
        </EmptyState>
      ) : (
        <DebtorsGrid>
          {currentDebtors.map((customer) => {
            const overdueDays = getOverdueDays(customer);
            
            return (
              <DebtorCard key={customer._id} $overdueDays={overdueDays}>
                <DebtorHeader>
                  <DebtorInfo $overdueDays={overdueDays}>
                    <h3>{customer.fullName}</h3>
                    <div className="overdue-badge">
                      <Clock size={12} />
                      {overdueDays} kun kechikkan
                    </div>
                  </DebtorInfo>
                  <ActionButtons>
                    <ActionButton 
                      className="sms" 
                      onClick={() => handleSendSMS(customer, activeTab === '3days')}
                      title={activeTab === '3days' ? "Kafilga SMS yuborish" : "Mijozga SMS yuborish"}
                    >
                      {activeTab === '3days' ? <Users size={16} /> : <MessageSquare size={16} />}
                    </ActionButton>
                    <ActionButton 
                      className="view" 
                      onClick={() => handleViewCustomer(customer)}
                      title="Batafsil ko'rish"
                    >
                      <Eye size={16} />
                    </ActionButton>
                  </ActionButtons>
                </DebtorHeader>

                <DebtorDetails>
                  <DetailRow>
                    <Phone className="icon" size={16} />
                    <span className="value">{formatPhoneNumber(customer.phone)}</span>
                  </DetailRow>
                  <DetailRow>
                    <MapPin className="icon" size={16} />
                    <span className="value">{customer.address || 'Manzil ko\'rsatilmagan'}</span>
                  </DetailRow>
                  <DetailRow>
                    <Calendar className="icon" size={16} />
                    <span>To'lov sanasi:</span>
                    <span className="value">{formatDate(customer.creditInfo?.nextPaymentDate)}</span>
                  </DetailRow>
                  <DetailRow>
                    <Users className="icon" size={16} />
                    <span>Kafil:</span>
                    <span className="value">{customer.guarantor?.name}</span>
                  </DetailRow>
                  <DetailRow>
                    <Phone className="icon" size={16} />
                    <span>Kafil tel:</span>
                    <span className="value">{formatPhoneNumber(customer.guarantor?.phone)}</span>
                  </DetailRow>
                </DebtorDetails>

                <PaymentInfo>
                  <div className="payment-row">
                    <span className="label">Mahsulot:</span>
                    <span className="value">{customer.product?.name}</span>
                  </div>
                  <div className="payment-row">
                    <span className="label">Oylik to'lov:</span>
                    <span className="value">{formatCurrency(customer.product?.monthlyPayment)} so'm</span>
                  </div>
                  <div className="payment-row">
                    <span className="label">Qolgan summa:</span>
                    <span className="value">{formatCurrency(customer.creditInfo?.remainingAmount)} so'm</span>
                  </div>
                </PaymentInfo>
              </DebtorCard>
            );
          })}
        </DebtorsGrid>
      )}
    </PageContainer>
  );
};

export default Debtors;