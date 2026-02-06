import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Users, 
  Eye,
  FileText
} from 'lucide-react';
import apiService, { getImageUrl } from '../services/api';
import { formatPhoneNumber, formatCurrency, formatDate } from '../utils/formatters';
import ImageModal from '../components/UI/ImageModal';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  .back-btn {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: none;
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }
  }
  
  h1 {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #1e293b, #475569);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    letter-spacing: -0.5px;
    
    @media (max-width: 768px) {
      font-size: 24px;
    }
  }
`;

const CustomerGrid = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 200px 1fr;
    gap: 20px;
  }
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ImageSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
  position: sticky;
  top: 24px;
  
  @media (max-width: 968px) {
    position: static;
    padding: 16px;
  }
  
  h3 {
    margin: 0 0 16px 0;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
  }
`;

const SingleImageContainer = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(226, 232, 240, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.02);
  }
  
  .image-counter {
    position: absolute;
    top: 6px;
    right: 6px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 3px 6px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 600;
  }
`;

const NoImages = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px dashed rgba(226, 232, 240, 0.8);
  
  .icon {
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    h3 {
      margin: 0;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 700;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: rgba(248, 250, 252, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(248, 250, 252, 0.8);
    border-color: #3b82f6;
    transform: translateY(-1px);
  }
  
  .label {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    font-size: 16px;
    color: #1e293b;
    font-weight: 700;
    word-break: break-word;
  }
`;

const CreditInfoCard = styled.div`
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    pointer-events: none;
  }
  
  .credit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
    
    h3 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 22px;
      font-weight: 800;
      
      @media (max-width: 768px) {
        justify-content: center;
      }
    }
    
    .status {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 700;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }
  
  .credit-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  
  .credit-item {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 16px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    .label {
      font-size: 13px;
      opacity: 0.9;
      margin-bottom: 6px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .value {
      font-size: 18px;
      font-weight: 800;
      word-break: break-word;
    }
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

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Image modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCustomer(id);
      if (response.success) {
        setCustomer(response.customer);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerUpdated = () => {
    fetchCustomer(); // Refresh customer data
  };

  // Image modal handlers
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleNextImage = () => {
    if (currentImageIndex < customer.profileImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setCurrentImageIndex(0);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Yuklanmoqda...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer>
        <div>Mijoz topilmadi</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <button className="back-btn" onClick={() => navigate('/customers')}>
          <ArrowLeft size={20} />
        </button>
        <h1>{customer.fullName}</h1>
      </Header>

      <CustomerGrid>
        {/* Images Section */}
        <ImageSection>
          <h3>
            <Eye size={20} />
            Mijoz rasmlari
          </h3>
          {customer.profileImages && customer.profileImages.length > 0 ? (
            <SingleImageContainer onClick={() => handleImageClick(0)}>
              <img src={getImageUrl(customer.profileImages[0])} alt={customer.fullName} />
              {customer.profileImages.length > 1 && (
                <div className="image-counter">
                  1 / {customer.profileImages.length}
                </div>
              )}
            </SingleImageContainer>
          ) : (
            <NoImages>
              <Eye size={48} className="icon" />
              <p>Rasm yuklanmagan</p>
            </NoImages>
          )}
        </ImageSection>

        {/* Info Section */}
        <InfoSection>
          {/* Credit Info Card */}
          <CreditInfoCard>
            <div className="credit-header">
              <h3>
                <CreditCard size={24} />
                Kredit ma'lumotlari
              </h3>
              <div className="status">Faol</div>
            </div>
            <div className="credit-grid">
              <div className="credit-item">
                <div className="label">Kredit olgan sana</div>
                <div className="value">{formatDate(customer.creditInfo?.startDate)}</div>
              </div>
              <div className="credit-item">
                <div className="label">Keyingi to'lov</div>
                <div className="value">{formatDate(customer.creditInfo?.nextPaymentDate)}</div>
              </div>
              <div className="credit-item">
                <div className="label">Oylik to'lov</div>
                <div className="value">{formatCurrency(customer.product?.monthlyPayment)} so'm</div>
              </div>
              <div className="credit-item">
                <div className="label">Qolgan summa</div>
                <div className="value">{formatCurrency(customer.creditInfo?.remainingAmount)} so'm</div>
              </div>
            </div>
          </CreditInfoCard>

          {/* Personal Info */}
          <InfoCard>
            <div className="card-header">
              <h3>
                <User size={20} />
                Shaxsiy ma'lumotlar
              </h3>
            </div>
            <InfoGrid>
              <InfoItem>
                <span className="label">To'liq ismi</span>
                <span className="value">{customer.fullName}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Telefon raqam</span>
                <span className="value">{formatPhoneNumber(customer.phone)}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Tug'ilgan sana</span>
                <span className="value">{customer.birthDate ? formatDate(customer.birthDate) : 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Viloyat</span>
                <span className="value">{customer.region || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Tuman</span>
                <span className="value">{customer.district || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Manzil</span>
                <span className="value">{customer.address || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Uy raqami</span>
                <span className="value">{customer.houseNumber || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Pasport seriyasi</span>
                <span className="value">{customer.passportSeries || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
            </InfoGrid>
          </InfoCard>

          {/* Guarantor Info */}
          <InfoCard>
            <div className="card-header">
              <h3>
                <Users size={20} />
                Kafil ma'lumotlari
              </h3>
            </div>
            <InfoGrid>
              <InfoItem>
                <span className="label">Kafil ismi</span>
                <span className="value">{customer.guarantor?.name}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Telefon raqam</span>
                <span className="value">{formatPhoneNumber(customer.guarantor?.phone)}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Tug'ilgan sana</span>
                <span className="value">{customer.guarantor?.birthDate ? formatDate(customer.guarantor.birthDate) : 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Viloyat</span>
                <span className="value">{customer.guarantor?.region || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Tuman</span>
                <span className="value">{customer.guarantor?.district || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Manzil</span>
                <span className="value">{customer.guarantor?.address || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Uy raqami</span>
                <span className="value">{customer.guarantor?.houseNumber || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Pasport seriyasi</span>
                <span className="value">{customer.guarantor?.passportSeries || 'Ko\'rsatilmagan'}</span>
              </InfoItem>
            </InfoGrid>
          </InfoCard>

          {/* Product Info */}
          <InfoCard>
            <div className="card-header">
              <h3>
                <FileText size={20} />
                Mahsulot ma'lumotlari
              </h3>
            </div>
            <InfoGrid>
              <InfoItem>
                <span className="label">Mahsulot nomi</span>
                <span className="value">{customer.product?.name}</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Asl narx</span>
                <span className="value">{formatCurrency(customer.product?.originalPrice)} so'm</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Ustama</span>
                <span className="value">{customer.product?.profitPercentage}%</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Sotiladigan narx</span>
                <span className="value">{formatCurrency(customer.product?.sellingPrice)} so'm</span>
              </InfoItem>
              <InfoItem>
                <span className="label">Muddati</span>
                <span className="value">{customer.product?.installmentMonths} oy</span>
              </InfoItem>
              {customer.creditInfo?.initialPayment > 0 && (
                <InfoItem>
                  <span className="label">Boshlang'ich to'lov</span>
                  <span className="value">{formatCurrency(customer.creditInfo?.initialPayment)} so'm</span>
                </InfoItem>
              )}
            </InfoGrid>
          </InfoCard>
        </InfoSection>
      </CustomerGrid>

      {/* Image Modal */}
      {showImageModal && customer?.profileImages && (
        <ImageModal
          images={customer.profileImages.map(img => getImageUrl(img))}
          currentIndex={currentImageIndex}
          onClose={closeImageModal}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </PageContainer>
  );
};

export default CustomerDetail;