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
  Eye,
  Download,
  PhoneCall,
  X
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

const ExportButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
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

const DebtorCard = styled.div.attrs(props => ({
  style: {
    borderLeftColor: props.$overdueDays >= 3 ? '#dc2626' : '#f59e0b'
  }
}))`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
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

const DebtorInfo = styled.div.attrs(props => ({
  style: {
    '--badge-bg': props.$overdueDays >= 3 ? '#dc2626' : '#f59e0b'
  }
}))`
  flex: 1;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 8px 0;
  }
  
  .overdue-badge {
    background: var(--badge-bg);
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    color: #374151;
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 4px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #374151;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &.primary {
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  }
  
  &.secondary {
    background: #e9ecef;
    color: #374151;
    
    &:hover {
      background: #dee2e6;
    }
  }
`;

const CallNoteDisplay = styled.div`
  background: #f0f9ff;
  border-left: 3px solid #3b82f6;
  padding: 12px;
  margin-top: 12px;
  border-radius: 4px;
  
  .note-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #3b82f6;
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 6px;
  }
  
  .note-text {
    color: #374151;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .note-date {
    color: #6c757d;
    font-size: 12px;
    margin-top: 6px;
  }
`;

const Debtors = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [activeTab, setActiveTab] = useState('all');
  const [overdue1Day, setOverdue1Day] = useState([]);
  const [overdue3Days, setOverdue3Days] = useState([]);
  const [allOverdue, setAllOverdue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [callNote, setCallNote] = useState('');

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
      
      // Combine all overdue customers
      const all1Day = response1Day?.customers || [];
      const all3Days = response3Days?.customers || [];
      const allCustomers = [...all1Day, ...all3Days];
      // Remove duplicates by ID
      const uniqueCustomers = allCustomers.filter((customer, index, self) =>
        index === self.findIndex((c) => c._id === customer._id)
      );
      setAllOverdue(uniqueCustomers);
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

  const exportToExcel = () => {
    try {
      // Create worksheet data
      const headers = [
        'T/r',
        'F.I.O',
        'Telefon',
        'Viloyat',
        'Tuman',
        'Manzil',
        'Mahsulot',
        'Qarz summasi',
        'Oylik to\'lov',
        'Keyingi to\'lov sanasi',
        'Kechikkan kunlar',
        'Kafil F.I.O',
        'Kafil telefon'
      ];
      
      const rows = allOverdue.map((customer, index) => {
        const overdueDays = getOverdueDays(customer);
        return [
          index + 1,
          customer.fullName || '',
          formatPhoneNumber(customer.phone) || '',
          customer.region || '',
          customer.district || '',
          customer.address || '',
          customer.product?.name || '',
          (customer.creditInfo?.remainingAmount || 0).toString(),
          (customer.product?.monthlyPayment || 0).toString(),
          formatDate(customer.creditInfo?.nextPaymentDate) || '',
          overdueDays.toString(),
          customer.guarantor?.name || '',
          formatPhoneNumber(customer.guarantor?.phone) || ''
        ];
      });
      
      // Create HTML table for Excel
      let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
      html += '<head><meta charset="utf-8"><style>table {border-collapse: collapse;} th, td {border: 1px solid black; padding: 8px; text-align: left;}</style></head>';
      html += '<body><table>';
      
      // Add headers
      html += '<tr>';
      headers.forEach(header => {
        html += `<th>${header}</th>`;
      });
      html += '</tr>';
      
      // Add rows
      rows.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
          html += `<td>${cell}</td>`;
        });
        html += '</tr>';
      });
      
      html += '</table></body></html>';
      
      // Create blob and download
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Qarzdorlar_${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess(`${allOverdue.length} ta qarzdor Excel faylga yuklandi`);
    } catch (error) {
      console.error('Excel export error:', error);
      showError('Excel faylni yuklab olishda xatolik');
    }
  };

  const handleViewCustomer = (customer) => {
    navigate(`/customers/${customer._id}`);
  };

  const handleAddCallNote = (customer) => {
    setSelectedCustomer(customer);
    setCallNote(customer.callNote || '');
    setShowNoteModal(true);
  };

  const handleSaveCallNote = async () => {
    try {
      console.log('💾 Saving call note...');
      console.log('Customer ID:', selectedCustomer._id);
      console.log('Call note:', callNote);
      
      // Update customer with call note
      const response = await apiService.updateCustomer(selectedCustomer._id, {
        callNote: callNote,
        lastCallDate: new Date()
      });

      console.log('✅ Response:', response);

      if (response.success) {
        showSuccess('Izoh saqlandi');
        setShowNoteModal(false);
        setSelectedCustomer(null);
        setCallNote('');
        loadDebtors(); // Reload to show updated note
      }
    } catch (error) {
      console.error('❌ Error saving call note:', error);
      showError('Izohni saqlashda xatolik');
    }
  };

  const getCurrentDebtors = () => {
    if (activeTab === 'all') return allOverdue;
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
        {activeTab === 'all' && allOverdue.length > 0 && (
          <ExportButton onClick={exportToExcel}>
            <Download size={20} />
            Excel yuklab olish ({allOverdue.length})
          </ExportButton>
        )}
      </PageHeader>

      <TabsContainer>
        <Tab 
          $active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          <Users size={16} />
          Barchasi
          <span className="count">{allOverdue.length}</span>
        </Tab>
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
                    <ActionButton 
                      className="call" 
                      onClick={() => handleAddCallNote(customer)}
                      title="Telefon qilindi"
                      style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#8b5cf6';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = '#8b5cf6';
                      }}
                    >
                      <PhoneCall size={16} />
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

                {customer.callNote && (
                  <CallNoteDisplay>
                    <div className="note-header">
                      <PhoneCall size={14} />
                      Qo'ng'iroq izohi
                    </div>
                    <div className="note-text">{customer.callNote}</div>
                    {customer.lastCallDate && (
                      <div className="note-date">
                        {formatDate(customer.lastCallDate)}
                      </div>
                    )}
                  </CallNoteDisplay>
                )}
              </DebtorCard>
            );
          })}
        </DebtorsGrid>
      )}

      {showNoteModal && (
        <Modal onClick={() => setShowNoteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Qo'ng'iroq izohi</h3>
              <CloseButton onClick={() => setShowNoteModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>
            <TextArea
              value={callNote}
              onChange={(e) => setCallNote(e.target.value)}
              placeholder="Qo'ng'iroq haqida izoh yozing..."
            />
            <ModalActions>
              <Button 
                className="secondary" 
                onClick={() => setShowNoteModal(false)}
              >
                Bekor qilish
              </Button>
              <Button 
                className="primary" 
                onClick={handleSaveCallNote}
              >
                Saqlash
              </Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Debtors;