import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Search, 
  Users, 
  Phone, 
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  TrendingUp,
  DollarSign,
  Activity,
  Banknote,
  Wallet,
  FileText,
  Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import apiService, { getImageUrl } from '../services/api';
import AddCustomerModal from '../components/Customers/AddCustomerModal';
import EditCustomerModal from '../components/Customers/EditCustomerModal';
import ContractModal from '../components/Customers/ContractModal';
import ImageModal from '../components/UI/ImageModal';
import InstallmentCalculator from '../components/InstallmentCalculator';
import HighlightedText from '../components/HighlightedText';
import { formatPhoneNumber, formatCurrency, formatDate, formatDateForInput, isToday, isDueSoon, getDaysUntil } from '../utils/formatters';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;
const PageTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 480px) {
    gap: 12px;
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
      font-size: 28px;
    }
    
    @media (max-width: 480px) {
      font-size: 24px;
    }
  }
  
  .icon {
    color: #3b82f6;
    filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
    
    @media (max-width: 480px) {
      width: 28px;
      height: 28px;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const StatsContainer = styled.div`
  margin-bottom: 24px;
`;

const StatsText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  
  .count {
    color: #3b82f6;
    font-weight: 700;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  @media (max-width: 480px) {
    padding: 14px;
    border-radius: 12px;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    
    @media (max-width: 768px) {
      transform: translateY(-2px);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$gradient || 'linear-gradient(135deg, #3b82f6, #2563eb)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.$background || 'linear-gradient(135deg, #dbeafe, #bfdbfe)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || '#3b82f6'};
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 2px;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 8px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    gap: 8px;
    padding: 6px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
    padding: 4px;
    flex-direction: column;
  }
`;

const FilterTab = styled.button`
  padding: 12px 20px;
  border: 2px solid ${props => props.$active ? '#3b82f6' : 'transparent'};
  background: ${props => props.$active ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  flex: 1;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 14px;
    border-radius: 8px;
    min-height: 44px;
  }
  
  &:hover {
    border-color: #3b82f6;
    color: ${props => props.$active ? 'white' : '#3b82f6'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    
    @media (max-width: 768px) {
      transform: translateY(-1px);
    }
  }
  
  .count {
    background: ${props => props.$active ? 'rgba(255,255,255,0.2)' : 'rgba(59, 130, 246, 0.1)'};
    color: ${props => props.$active ? 'white' : '#3b82f6'};
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    min-width: 20px;
    text-align: center;
    
    @media (max-width: 480px) {
      padding: 3px 6px;
      font-size: 11px;
    }
  }
`;
const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const SearchContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
  
  @media (max-width: 768px) {
    min-width: 250px;
  }
  
  @media (max-width: 480px) {
    min-width: 100%;
  }
  
  input {
    width: 100%;
    padding: 16px 20px 16px 50px;
    border: 2px solid rgba(226, 232, 240, 0.8);
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    
    @media (max-width: 480px) {
      padding: 14px 18px 14px 45px;
      font-size: 16px; /* Prevents zoom on iOS */
    }
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      background: white;
    }
    
    &::placeholder {
      color: #94a3b8;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    transition: color 0.3s ease;
    
    @media (max-width: 480px) {
      left: 15px;
    }
  }
  
  &:focus-within .search-icon {
    color: #3b82f6;
  }
`;
const CustomersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const CustomerCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
    
    @media (max-width: 768px) {
      transform: translateY(-3px);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  }
`;
const CustomerImageSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: ${props => props.$viewMode === 'list' ? '0' : '20px'};
  overflow-x: auto;
  padding-bottom: 5px;
  flex-shrink: 0;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.5);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.5);
    border-radius: 2px;
  }
  
  ${props => props.$viewMode === 'list' && `
    width: 120px;
    margin-bottom: 0;
  `}
`;

const CustomerImage = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(226, 232, 240, 0.8);
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    border-color: #3b82f6;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NoImagePlaceholder = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border: 2px dashed rgba(148, 163, 184, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: ${props => props.$viewMode === 'list' ? '10px' : '12px'};
  text-align: center;
  flex-shrink: 0;
  font-weight: 500;
`;

const CustomerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.$viewMode === 'list' ? '0' : '20px'};
  flex: ${props => props.$viewMode === 'list' ? '1' : 'auto'};
`;
const CustomerInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: ${props => props.$viewMode === 'list' ? '16px' : '20px'};
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    letter-spacing: -0.3px;
  }
  
  .customer-id {
    font-size: 11px;
    color: #64748b;
    background: rgba(148, 163, 184, 0.1);
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`;

const CustomerActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const ActionButton = styled.button`
  padding: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  min-width: 44px;
  min-height: 44px;
  
  @media (max-width: 768px) {
    padding: 14px;
    min-width: 48px;
    min-height: 48px;
  }
  
  &.view {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2));
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  &.edit {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
    color: #d97706;
    border: 1px solid rgba(245, 158, 11, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  &.delete {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
    color: #dc2626;
    border: 1px solid rgba(239, 68, 68, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  &.payment {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
    color: #059669;
    border: 1px solid rgba(16, 185, 129, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  &.contract {
    background: linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(120, 53, 15, 0.1));
    color: #8b4513;
    border: 1px solid rgba(139, 69, 19, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, rgba(139, 69, 19, 0.2), rgba(120, 53, 15, 0.2));
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
`;
const CustomerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: ${props => props.$viewMode === 'list' ? '1' : 'auto'};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #64748b;
  
  .icon {
    color: #94a3b8;
    min-width: 16px;
    flex-shrink: 0;
  }
  
  .value {
    color: #1e293b;
    font-weight: 500;
  }
`;

const CreditInfo = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.05));
  border-radius: 16px;
  padding: 16px;
  margin: ${props => props.$viewMode === 'list' ? '0 20px' : '20px 0'};
  border-left: 4px solid #3b82f6;
  backdrop-filter: blur(10px);
  flex: ${props => props.$viewMode === 'list' ? '1' : 'auto'};
`;

const CreditRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
    font-weight: 700;
    color: #1e293b;
    padding-top: 8px;
    border-top: 1px solid rgba(148, 163, 184, 0.2);
  }
  
  .label {
    color: #64748b;
    font-weight: 500;
  }
  
  .value {
    color: #1e293b;
    font-weight: 600;
  }
`;

const NextPaymentDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  margin-top: ${props => props.$viewMode === 'list' ? '0' : '16px'};
  backdrop-filter: blur(10px);
  
  ${props => {
    if (props.$isToday) {
      return `
        background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
        color: #92400e;
        border: 1px solid rgba(251, 191, 36, 0.3);
      `;
    } else if (props.$isDueSoon) {
      return `
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
        color: #991b1b;
        border: 1px solid rgba(239, 68, 68, 0.3);
      `;
    } else {
      return `
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
        color: #065f46;
        border: 1px solid rgba(16, 185, 129, 0.3);
      `;
    }
  }}
`;
const ProductInfo = styled.div`
  background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8));
  border-radius: 16px;
  padding: 16px;
  margin-top: ${props => props.$viewMode === 'list' ? '0' : '20px'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.5);
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #1e293b;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .product-details {
    display: grid;
    grid-template-columns: ${props => props.$viewMode === 'list' ? '1fr 1fr' : 'repeat(2, 1fr)'};
    gap: 12px;
    font-size: 13px;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .label {
      color: #64748b;
      font-weight: 500;
    }
    
    .value {
      color: #1e293b;
      font-weight: 600;
    }
  }
`;

const GuarantorInfo = styled.div`
  border-top: 1px solid rgba(226, 232, 240, 0.5);
  padding-top: 16px;
  margin-top: ${props => props.$viewMode === 'list' ? '0' : '20px'};
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #1e293b;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .icon {
    font-size: 64px;
    margin-bottom: 24px;
    opacity: 0.5;
    color: #94a3b8;
  }
  
  h3 {
    font-size: 24px;
    margin-bottom: 12px;
    color: #1e293b;
    font-weight: 700;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 32px;
    color: #64748b;
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(59, 130, 246, 0.1);
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Payment Modal Components
const PaymentModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PaymentModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 16px;
    width: 95%;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
    width: 95%;
    max-height: 95vh;
  }
  
  h3 {
    margin: 0 0 24px 0;
    color: #1e293b;
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    
    @media (max-width: 480px) {
      font-size: 20px;
      margin-bottom: 20px;
    }
  }
  
  .payment-methods {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    
    @media (max-width: 480px) {
      gap: 12px;
      margin-bottom: 20px;
    }
  }
  
  .payment-method {
    flex: 1;
    padding: 16px;
    border: 2px solid rgba(226, 232, 240, 0.8);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    
    @media (max-width: 480px) {
      padding: 14px 12px;
      border-radius: 8px;
    }
    
    &:hover {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.05);
    }
    
    &.active {
      border-color: #3b82f6;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
    }
    
    .method-name {
      font-weight: 600;
      color: #1e293b;
      margin-top: 8px;
      
      @media (max-width: 480px) {
        font-size: 14px;
        margin-top: 6px;
      }
    }
  }
  
  .amount-input {
    margin-bottom: 24px;
    
    @media (max-width: 480px) {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #1e293b;
      
      @media (max-width: 480px) {
        font-size: 14px;
      }
    }
    
    input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid rgba(226, 232, 240, 0.8);
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.9);
      
      @media (max-width: 480px) {
        padding: 14px 16px;
        border-radius: 8px;
      }
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        background: white;
      }
    }
  }
  
  .buttons {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    
    @media (max-width: 480px) {
      gap: 12px;
      flex-direction: column-reverse;
    }
  }
  
  button {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    @media (max-width: 480px) {
      padding: 14px 20px;
      border-radius: 8px;
      font-size: 16px;
      min-height: 48px;
    }
    
    &.cancel {
      background: rgba(148, 163, 184, 0.1);
      color: #64748b;
      border: 2px solid rgba(226, 232, 240, 0.8);
      
      &:hover:not(:disabled) {
        background: rgba(148, 163, 184, 0.2);
        border-color: #94a3b8;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    
    &.pay {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        
        @media (max-width: 768px) {
          transform: translateY(-1px);
        }
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
// Modal komponentlari
const EditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const EditModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h3 {
    margin: 0 0 24px 0;
    color: #1e293b;
    font-size: 24px;
    font-weight: 700;
  }
  
  input {
    width: 100%;
    padding: 16px 20px;
    border: 2px solid rgba(226, 232, 240, 0.8);
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      background: white;
    }
  }
  
  .buttons {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
  }
  
  button {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &.save {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
      }
    }
    
    &.cancel {
      background: rgba(148, 163, 184, 0.1);
      color: #64748b;
      border: 2px solid rgba(226, 232, 240, 0.8);
      
      &:hover {
        background: rgba(148, 163, 184, 0.2);
        border-color: #94a3b8;
      }
    }
  }
`;
const ViewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ViewModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 16px;
    max-height: 85vh;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
    max-height: 90vh;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 2px solid rgba(226, 232, 240, 0.5);
    
    @media (max-width: 480px) {
      margin-bottom: 24px;
      padding-bottom: 16px;
    }
    
    h2 {
      margin: 0;
      color: #1e293b;
      font-size: 28px;
      font-weight: 800;
      
      @media (max-width: 768px) {
        font-size: 24px;
      }
      
      @media (max-width: 480px) {
        font-size: 20px;
      }
    }
    
    .close-btn {
      background: rgba(148, 163, 184, 0.1);
      border: none;
      cursor: pointer;
      padding: 12px;
      border-radius: 12px;
      color: #64748b;
      transition: all 0.3s ease;
      
      @media (max-width: 480px) {
        padding: 10px;
        border-radius: 8px;
      }
      
      &:hover {
        background: rgba(148, 163, 184, 0.2);
        color: #475569;
        transform: scale(1.1);
      }
    }
  }
  
  .section {
    margin-bottom: 32px;
    
    @media (max-width: 480px) {
      margin-bottom: 24px;
    }
    
    h3 {
      margin: 0 0 20px 0;
      color: #1e293b;
      font-size: 20px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 12px;
      
      @media (max-width: 480px) {
        font-size: 18px;
        margin-bottom: 16px;
        gap: 8px;
      }
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      
      @media (max-width: 480px) {
        gap: 4px;
      }
      
      .label {
        font-size: 12px;
        color: #64748b;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        
        @media (max-width: 480px) {
          font-size: 11px;
        }
      }
      
      .value {
        font-size: 16px;
        color: #1e293b;
        font-weight: 600;
        word-break: break-word;
        
        @media (max-width: 480px) {
          font-size: 14px;
        }
      }
    }
  }
`;
const DeleteModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DeleteModalContent = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: #dc2626;
  }
  
  h3 {
    margin: 0 0 12px 0;
    color: #1e293b;
    font-size: 24px;
    font-weight: 700;
  }
  
  p {
    margin: 0 0 32px 0;
    color: #64748b;
    line-height: 1.6;
    font-size: 16px;
  }
  
  .buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
  
  button {
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &.cancel {
      background: rgba(148, 163, 184, 0.1);
      color: #64748b;
      border: 2px solid rgba(226, 232, 240, 0.8);
      
      &:hover {
        background: rgba(148, 163, 184, 0.2);
        border-color: #94a3b8;
      }
    }
    
    &.delete {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
      }
    }
  }
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.4);
  transition: all 0.3s ease;
  z-index: 999;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 30px rgba(52, 152, 219, 0.6);
  }
  
  &:active {
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    bottom: 80px;
    right: 16px;
    width: 56px;
    height: 56px;
  }
`;

const Customers = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingPayment, setEditingPayment] = useState(null);
  const [newPaymentDate, setNewPaymentDate] = useState('');
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  
  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCustomer, setPaymentCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  // Image modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  
  // Calculator modal state
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Contract generation states
  const [contractLoading, setContractLoading] = useState({});
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractCustomer, setContractCustomer] = useState(null);
  const [customerContractLoading, setCustomerContractLoading] = useState(false);
  const [guarantorContractLoading, setGuarantorContractLoading] = useState(false);
  const { addNotification } = useNotification();

  // Load customers when component mounts
  useEffect(() => {
    loadCustomers();
  }, []);

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (showImageModal) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          handleNextImage();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          handlePrevImage();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closeImageModal();
        }
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showImageModal, currentImageIndex, currentImages.length]);

  // Cleanup body scroll on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      let response;
      
      switch (activeFilter) {
        case 'today':
          response = await apiService.getCustomersDueToday();
          break;
        case 'soon':
          response = await apiService.getCustomersDueSoon();
          break;
        default:
          response = await apiService.getCustomers();
      }
      
      if (response.success) {
        setCustomers(response.customers || []);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      addNotification('Mijozlarni yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reload when filter changes
  useEffect(() => {
    loadCustomers();
  }, [activeFilter]);

  const handleAddCustomer = () => {
    setShowAddModal(true);
  };

  const handleCustomerAdded = () => {
    loadCustomers();
    setShowAddModal(false);
    addNotification('Mijoz muvaffaqiyatli qo\'shildi', 'success');
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  const handleCustomerUpdated = () => {
    loadCustomers();
    setShowEditModal(false);
    setEditingCustomer(null);
    addNotification('Mijoz muvaffaqiyatli yangilandi', 'success');
  };

  const handleEditPaymentDate = (customer) => {
    setEditingPayment(customer);
    setNewPaymentDate(formatDateForInput(customer.creditInfo.nextPaymentDate));
  };

  const handleSavePaymentDate = async () => {
    try {
      const response = await apiService.updateNextPaymentDate(editingPayment._id, newPaymentDate);
      if (response.success) {
        addNotification('To\'lov sanasi yangilandi', 'success');
        loadCustomers();
        setEditingPayment(null);
      }
    } catch (error) {
      console.error('Error updating payment date:', error);
      addNotification('To\'lov sanasini yangilashda xatolik', 'error');
    }
  };

  const handleViewCustomer = (customer) => {
    navigate(`/customers/${customer._id}`);
  };

  // Contract generation handler
  const handleGenerateContract = async (customer) => {
    setContractCustomer(customer);
    setShowContractModal(true);
  };

  const handleGenerateCustomerContract = async (customer) => {
    setCustomerContractLoading(true);
    
    try {
      const blob = await apiService.generateCustomerContract(customer._id);

      // DOCX faylni yuklab olish
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Shartnoma_${customer.fullName.replace(/\s+/g, '_')}_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showSuccess('Mijoz shartnomasi muvaffaqiyatli yaratildi');
      setShowContractModal(false);
    } catch (error) {
      console.error('❌ Shartnoma yaratishda xatolik:', error);
      showError('Shartnoma yaratishda xatolik: ' + error.message);
    } finally {
      setCustomerContractLoading(false);
    }
  };

  const handleGenerateGuarantorContract = async (customer) => {
    setGuarantorContractLoading(true);
    
    try {
      const blob = await apiService.generateGuarantorContract(customer._id);

      // DOCX faylni yuklab olish
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kafillik_shartnomasi_${customer.fullName.replace(/\s+/g, '_')}_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showSuccess('Kafillik shartnomasi muvaffaqiyatli yaratildi');
      setShowContractModal(false);
    } catch (error) {
      console.error('❌ Kafillik shartnomasi yaratishda xatolik:', error);
      showError('Kafillik shartnomasi yaratishda xatolik: ' + error.message);
    } finally {
      setGuarantorContractLoading(false);
    }
  };

  const handleDeleteCustomer = (customer) => {
    setDeletingCustomer(customer);
  };

  // Payment handlers
  const handlePayment = (customer) => {
    setPaymentCustomer(customer);
    setShowPaymentModal(true);
    setPaymentMethod('');
    setPaymentAmount('');
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentAmountChange = (e) => {
    const value = e.target.value.replace(/\s/g, ''); // Remove spaces
    if (value === '' || /^\d+$/.test(value)) {
      setPaymentAmount(value);
    }
  };

  const formatPaymentAmount = (amount) => {
    if (!amount) return '';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod || !paymentAmount || parseFloat(paymentAmount.replace(/\s/g, '')) <= 0) {
      addNotification('To\'lov usuli va summani to\'ldiring', 'error');
      return;
    }

    const amount = parseFloat(paymentAmount.replace(/\s/g, ''));
    const remainingAmount = paymentCustomer.creditInfo?.remainingAmount || 0;

    if (amount > remainingAmount) {
      addNotification('To\'lov summasi qolgan summadan ko\'p bo\'lishi mumkin emas', 'error');
      return;
    }

    setPaymentLoading(true);

    try {
      // Calculate new remaining amount
      const newRemainingAmount = remainingAmount - amount;
      
      // Calculate remaining months (assuming installmentMonths is total months)
      const totalMonths = paymentCustomer.product?.installmentMonths || 12;
      const currentMonthlyPayment = paymentCustomer.product?.monthlyPayment || 0;
      
      // Calculate how many months have passed based on remaining amount vs total amount
      const totalAmount = paymentCustomer.product?.sellingPrice || 0;
      const initialPayment = paymentCustomer.creditInfo?.initialPayment || 0;
      const totalCreditAmount = totalAmount - initialPayment;
      
      // Calculate remaining months based on new remaining amount
      let remainingMonths = 0;
      let newMonthlyPayment = currentMonthlyPayment;
      
      if (newRemainingAmount > 0) {
        // Find how many months are left based on payment schedule
        const paidAmount = totalCreditAmount - remainingAmount;
        const totalPaidAmount = paidAmount + amount;
        const monthsPassed = Math.floor(totalPaidAmount / currentMonthlyPayment);
        remainingMonths = Math.max(0, totalMonths - monthsPassed);
        
        // Recalculate monthly payment for remaining months
        if (remainingMonths > 0) {
          newMonthlyPayment = Math.ceil(newRemainingAmount / remainingMonths);
        }
      }

      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Real API call:
      const response = await apiService.makePayment(paymentCustomer._id, {
        amount,
        method: paymentMethod,
        notes: `To'lov: ${formatCurrency(amount)} so'm`
      });

      if (response.success) {
        // Update customer data from backend response
        const updatedCustomers = customers.map(customer => {
          if (customer._id === paymentCustomer._id) {
            return response.customer;
          }
          return customer;
        });
        
        setCustomers(updatedCustomers);
        
        addNotification(
          `To'lov muvaffaqiyatli amalga oshirildi!\n` +
          `Qolgan summa: ${formatCurrency(response.payment.remainingAmount)} so'm\n` +
          `${response.payment.remainingMonths > 0 ? 
            `Yangi oylik to'lov: ${formatCurrency(response.payment.newMonthlyPayment)} so'm\n` +
            `Qolgan oylar: ${response.payment.remainingMonths} oy` : 
            'To\'lov to\'liq tugallandi! 🎉'
          }`, 
          'success'
        );
        
        setShowPaymentModal(false);
        setPaymentCustomer(null);
        setPaymentMethod('');
        setPaymentAmount('');
        // Re-enable body scroll
        document.body.style.overflow = 'unset';
      }
      
      /* 
      // Old simulation code:
      // Update customer data locally (in real app, this would come from backend)
      const updatedCustomers = customers.map(customer => {
        if (customer._id === paymentCustomer._id) {
          return {
            ...customer,
            creditInfo: {
              ...customer.creditInfo,
              remainingAmount: newRemainingAmount
            },
            product: {
              ...customer.product,
              monthlyPayment: newMonthlyPayment,
              installmentMonths: remainingMonths
            }
          };
        }
        return customer;
      });
      
      setCustomers(updatedCustomers);
      
      addNotification(
        `To'lov muvaffaqiyatli amalga oshirildi. Yangi qolgan summa: ${formatCurrency(newRemainingAmount)} so'm${
          remainingMonths > 0 ? `, Yangi oylik to'lov: ${formatCurrency(newMonthlyPayment)} so'm` : ''
        }`, 
        'success'
      );
      
      setShowPaymentModal(false);
      setPaymentCustomer(null);
      setPaymentMethod('');
      setPaymentAmount('');
      // Re-enable body scroll
      document.body.style.overflow = 'unset';
      */
    } catch (error) {
      console.error('Error making payment:', error);
      addNotification('To\'lov qilishda xatolik yuz berdi', 'error');
    } finally {
      setPaymentLoading(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentCustomer(null);
    setPaymentMethod('');
    setPaymentAmount('');
    setPaymentLoading(false);
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
  };
  // Image modal handlers
  const handleImageClick = (images, index) => {
    setCurrentImages(images.map(img => getImageUrl(img)));
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleNextImage = () => {
    if (currentImageIndex < currentImages.length - 1) {
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
    setCurrentImages([]);
    setCurrentImageIndex(0);
  };

  const confirmDeleteCustomer = async () => {
    try {
      const response = await apiService.deleteCustomer(deletingCustomer._id);
      if (response.success) {
        addNotification('Mijoz muvaffaqiyatli o\'chirildi', 'success');
        loadCustomers();
        setDeletingCustomer(null);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      addNotification('Mijozni o\'chirishda xatolik', 'error');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.guarantor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count customers by filter
  const getFilterCounts = () => {
    const today = customers.filter(c => isToday(c.creditInfo?.nextPaymentDate));
    const soon = customers.filter(c => isDueSoon(c.creditInfo?.nextPaymentDate));
    return { today: today.length, soon: soon.length, all: customers.length };
  };

  // Calculate stats
  const getStats = () => {
    const totalCustomers = customers.length;
    const totalCredit = customers.reduce((sum, c) => sum + (c.creditInfo?.remainingAmount || 0), 0);
    const monthlyIncome = customers.reduce((sum, c) => sum + (c.product?.monthlyPayment || 0), 0);
    const overdueCustomers = customers.filter(c => {
      const paymentDate = new Date(c.creditInfo?.nextPaymentDate);
      const today = new Date();
      return paymentDate < today;
    }).length;

    return {
      totalCustomers,
      totalCredit,
      monthlyIncome,
      overdueCustomers
    };
  };

  const filterCounts = getFilterCounts();
  const stats = getStats();

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>
          <div className="spinner"></div>
        </LoadingState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <Users className="icon" size={36} />
          <h1>Mijozlar</h1>
        </PageTitle>
        <HeaderActions>
          <AddButton onClick={handleAddCustomer}>
            <Plus size={20} />
            Mijoz qo'shish
          </AddButton>
        </HeaderActions>
      </PageHeader>

      <StatsContainer>
        <StatsText>
          <Users size={20} />
          Jami mijozlar: <span className="count">{stats.totalCustomers}</span>
        </StatsText>
        
        <StatsGrid>
          <StatCard $gradient="linear-gradient(135deg, #10b981, #059669)">
            <StatHeader>
              <StatIcon $background="linear-gradient(135deg, #d1fae5, #a7f3d0)" $color="#10b981">
                <DollarSign size={20} />
              </StatIcon>
              <div>
                <StatValue>{formatCurrency(stats.totalCredit)}</StatValue>
                <StatLabel>Jami kredit (so'm)</StatLabel>
              </div>
            </StatHeader>
          </StatCard>

          <StatCard $gradient="linear-gradient(135deg, #f59e0b, #d97706)">
            <StatHeader>
              <StatIcon $background="linear-gradient(135deg, #fef3c7, #fde68a)" $color="#f59e0b">
                <Activity size={20} />
              </StatIcon>
              <div>
                <StatValue>{formatCurrency(stats.monthlyIncome)}</StatValue>
                <StatLabel>Oylik daromad (so'm)</StatLabel>
              </div>
            </StatHeader>
          </StatCard>

          <StatCard $gradient="linear-gradient(135deg, #ef4444, #dc2626)">
            <StatHeader>
              <StatIcon $background="linear-gradient(135deg, #fee2e2, #fecaca)" $color="#ef4444">
                <AlertCircle size={20} />
              </StatIcon>
              <div>
                <StatValue>{stats.overdueCustomers}</StatValue>
                <StatLabel>Kechikkan to'lovlar</StatLabel>
              </div>
            </StatHeader>
          </StatCard>
        </StatsGrid>
      </StatsContainer>

      <SearchContainer>
        <SearchRow>
          <SearchInput>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Mijoz nomi, telefon yoki manzil bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          <FilterTabs style={{ margin: 0, flex: 1 }}>
            <FilterTab 
              $active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            >
              <Users size={16} />
              Barcha mijozlar
              <span className="count">{filterCounts.all}</span>
            </FilterTab>
            <FilterTab 
              $active={activeFilter === 'today'} 
              onClick={() => setActiveFilter('today')}
            >
              <AlertCircle size={16} />
              Bugun
              <span className="count">{filterCounts.today}</span>
            </FilterTab>
            <FilterTab 
              $active={activeFilter === 'soon'} 
              onClick={() => setActiveFilter('soon')}
            >
              <Clock size={16} />
              2 kun qoldi
              <span className="count">{filterCounts.soon}</span>
            </FilterTab>
          </FilterTabs>
        </SearchRow>
      </SearchContainer>

      {filteredCustomers.length === 0 ? (
        <EmptyState>
          <Users className="icon" />
          <h3>Mijozlar topilmadi</h3>
          <p>Hozircha mijozlar ro'yxati bo'sh. Birinchi mijozni qo'shing.</p>
          <AddButton onClick={handleAddCustomer}>
            <Plus size={20} />
            Mijoz qo'shish
          </AddButton>
        </EmptyState>
      ) : (
        <CustomersGrid>
          {filteredCustomers.map((customer) => {
            const nextPaymentDate = customer.creditInfo?.nextPaymentDate;
            const isPaymentToday = isToday(nextPaymentDate);
            const isPaymentDueSoon = isDueSoon(nextPaymentDate);
            
            return (
              <CustomerCard 
                key={customer._id}
                onDoubleClick={() => handleEditPaymentDate(customer)}
              >
                {/* Customer Header with Image and Basic Info */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  marginBottom: '16px'
                }}>
                  {/* Customer Image */}
                  {customer.profileImages && customer.profileImages.length > 0 ? (
                    <CustomerImage 
                      onClick={() => handleImageClick(customer.profileImages, 0)}
                      style={{ position: 'relative', flexShrink: 0 }}
                    >
                      <img src={getImageUrl(customer.profileImages[0])} alt={`${customer.fullName}`} />
                      {customer.profileImages.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '8px',
                          fontWeight: 'bold'
                        }}>
                          +{customer.profileImages.length - 1}
                        </div>
                      )}
                    </CustomerImage>
                  ) : (
                    <NoImagePlaceholder style={{ flexShrink: 0 }}>
                      <Users size={20} />
                    </NoImagePlaceholder>
                  )}

                  {/* Customer Name and Key Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      margin: '0 0 4px 0', 
                      fontSize: '18px', 
                      fontWeight: '700', 
                      color: '#1e293b',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <HighlightedText text={customer.fullName} highlight={searchTerm} />
                    </h3>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#64748b', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px',
                      marginBottom: '2px'
                    }}>
                      <Phone size={12} />
                      <HighlightedText text={formatPhoneNumber(customer.phone)} highlight={searchTerm} />
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#94a3b8',
                      fontStyle: 'italic',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      Kafil: <HighlightedText text={customer.guarantor?.name || 'Ko\'rsatilmagan'} highlight={searchTerm} />
                    </div>
                  </div>
                </div>

                {/* Payment Status Badge */}
                <NextPaymentDate 
                  $isToday={isPaymentToday}
                  $isDueSoon={isPaymentDueSoon}
                  style={{ marginBottom: '16px', fontSize: '12px', padding: '8px 12px' }}
                >
                  <Calendar size={14} />
                  {formatDate(nextPaymentDate)}
                  {isPaymentToday && ' (Bugun!)'}
                  {isPaymentDueSoon && ' (2 kun qoldi)'}
                </NextPaymentDate>

                {/* Key Financial Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '8px',
                  border: '1px solid rgba(226, 232, 240, 0.5)'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#64748b', 
                      fontWeight: '500', 
                      marginBottom: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      Qolgan summa
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '700', 
                      color: '#dc2626',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {formatCurrency(customer.creditInfo?.remainingAmount)} so'm
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#64748b', 
                      fontWeight: '500', 
                      marginBottom: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      Oylik to'lov
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '700', 
                      color: '#059669',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {formatCurrency(customer.product?.monthlyPayment)} so'm
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(226, 232, 240, 0.3)',
                  paddingTop: '12px',
                  flexWrap: 'wrap'
                }}>
                  <ActionButton 
                    className="view" 
                    onClick={() => handleViewCustomer(customer)}
                    style={{ 
                      minWidth: '40px',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '12px 8px',
                      flex: '1'
                    }}
                  >
                    <Eye size={16} />
                  </ActionButton>
                  <ActionButton 
                    className="edit" 
                    onClick={() => handleEditCustomer(customer)}
                    style={{ padding: '12px', flex: '1', minWidth: '40px' }}
                  >
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => handleDeleteCustomer(customer)}
                    style={{ padding: '12px', flex: '1', minWidth: '40px' }}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                  <ActionButton 
                    className="payment" 
                    onClick={() => handlePayment(customer)}
                    style={{ 
                      padding: '12px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                      color: '#059669',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      flex: '1',
                      minWidth: '40px'
                    }}
                  >
                    <Banknote size={16} />
                  </ActionButton>
                  <ActionButton 
                    className="contract" 
                    onClick={() => handleGenerateContract(customer)}
                    style={{ 
                      padding: '12px',
                      flex: '1',
                      minWidth: '40px'
                    }}
                    title="Shartnoma yaratish"
                  >
                    <FileText size={16} />
                  </ActionButton>
                </div>
              </CustomerCard>
            );
          })}
        </CustomersGrid>
      )}

      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleCustomerAdded}
        />
      )}

      {showEditModal && editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => {
            setShowEditModal(false);
            setEditingCustomer(null);
          }}
          onSuccess={handleCustomerUpdated}
        />
      )}

      {showContractModal && contractCustomer && (
        <ContractModal
          customer={contractCustomer}
          onClose={() => {
            setShowContractModal(false);
            setContractCustomer(null);
          }}
          onGenerateCustomerContract={handleGenerateCustomerContract}
          onGenerateGuarantorContract={handleGenerateGuarantorContract}
          customerContractLoading={customerContractLoading}
          guarantorContractLoading={guarantorContractLoading}
        />
      )}

      {editingPayment && (
        <EditModal onClick={(e) => e.target === e.currentTarget && setEditingPayment(null)}>
          <EditModalContent>
            <h3>Keyingi to'lov sanasini tahrirlash</h3>
            <input
              type="date"
              value={newPaymentDate}
              onChange={(e) => setNewPaymentDate(e.target.value)}
            />
            <div className="buttons">
              <button className="cancel" onClick={() => setEditingPayment(null)}>
                Bekor qilish
              </button>
              <button className="save" onClick={handleSavePaymentDate}>
                Saqlash
              </button>
            </div>
          </EditModalContent>
        </EditModal>
      )}

      {viewingCustomer && (
        <ViewModal onClick={(e) => e.target === e.currentTarget && setViewingCustomer(null)}>
          <ViewModalContent>
            <div className="modal-header">
              <h2>Mijoz ma'lumotlari</h2>
              <button className="close-btn" onClick={() => setViewingCustomer(null)}>
                <X size={24} />
              </button>
            </div>

            {/* Customer Images Section */}
            {viewingCustomer.profileImages && viewingCustomer.profileImages.length > 0 && (
              <div className="section">
                <h3>
                  <Eye size={20} />
                  Mijoz rasmlari
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                  gap: '12px',
                  marginTop: '16px'
                }}>
                  {viewingCustomer.profileImages.map((image, index) => (
                    <div key={index} style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '2px solid #e9ecef'
                    }}>
                      <img 
                        src={getImageUrl(image)} 
                        alt={`${viewingCustomer.fullName} ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="section">
              <h3>
                <Users size={20} />
                Shaxsiy ma'lumotlar
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">To'liq ismi</span>
                  <span className="value">{viewingCustomer.fullName}</span>
                </div>
                <div className="info-item">
                  <span className="label">Telefon raqam</span>
                  <span className="value">{formatPhoneNumber(viewingCustomer.phone)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tug'ilgan sana</span>
                  <span className="value">{viewingCustomer.birthDate ? formatDate(viewingCustomer.birthDate) : 'Ko\'rsatilmagan'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Viloyat</span>
                  <span className="value">{viewingCustomer.region || 'Ko\'rsatilmagan'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tuman</span>
                  <span className="value">{viewingCustomer.district || 'Ko\'rsatilmagan'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Manzil</span>
                  <span className="value">{viewingCustomer.address || 'Ko\'rsatilmagan'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Pasport seriyasi</span>
                  <span className="value">{viewingCustomer.passportSeries || 'Ko\'rsatilmagan'}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <h3>
                <Users size={20} />
                Kafil ma'lumotlari
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Kafil ismi</span>
                  <span className="value">{viewingCustomer.guarantor?.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Telefon raqam</span>
                  <span className="value">{formatPhoneNumber(viewingCustomer.guarantor?.phone)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tug'ilgan sana</span>
                  <span className="value">{viewingCustomer.guarantor?.birthDate ? formatDate(viewingCustomer.guarantor.birthDate) : 'Ko\'rsatilmagan'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Viloyat</span>
                  <span className="value">{viewingCustomer.guarantor?.region || 'Ko\'rsatilmagan'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tuman</span>
                  <span className="value">{viewingCustomer.guarantor?.district || 'Ko\'rsatilmagan'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Manzil</span>
                  <span className="value">{viewingCustomer.guarantor?.address || 'Ko\'rsatilmagan'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Pasport seriyasi</span>
                  <span className="value">{viewingCustomer.guarantor?.passportSeries || 'Ko\'rsatilmagan'}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <h3>
                <CreditCard size={20} />
                Mahsulot va kredit ma'lumotlari
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Mahsulot nomi</span>
                  <span className="value">{viewingCustomer.product?.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Asl narx</span>
                  <span className="value">{formatCurrency(viewingCustomer.product?.originalPrice)} so'm</span>
                </div>
                <div className="info-item">
                  <span className="label">Ustama</span>
                  <span className="value">{viewingCustomer.product?.profitPercentage}%</span>
                </div>
                <div className="info-item">
                  <span className="label">Sotuv narxi</span>
                  <span className="value">{formatCurrency(viewingCustomer.product?.sellingPrice)} so'm</span>
                </div>
                <div className="info-item">
                  <span className="label">Muddati</span>
                  <span className="value">{viewingCustomer.product?.installmentMonths} oy</span>
                </div>
                <div className="info-item">
                  <span className="label">Oylik to'lov</span>
                  <span className="value">{formatCurrency(viewingCustomer.product?.monthlyPayment)} so'm</span>
                </div>
                <div className="info-item">
                  <span className="label">Kredit olgan sana</span>
                  <span className="value">{formatDate(viewingCustomer.creditInfo?.startDate)}</span>
                </div>
                {viewingCustomer.creditInfo?.initialPayment > 0 && (
                  <div className="info-item">
                    <span className="label">Boshlang'ich to'lov</span>
                    <span className="value">{formatCurrency(viewingCustomer.creditInfo?.initialPayment)} so'm</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="label">Keyingi to'lov sanasi</span>
                  <span className="value">{formatDate(viewingCustomer.creditInfo?.nextPaymentDate)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Qolgan summa</span>
                  <span className="value">{formatCurrency(viewingCustomer.creditInfo?.remainingAmount)} so'm</span>
                </div>
              </div>
            </div>
          </ViewModalContent>
        </ViewModal>
      )}

      {deletingCustomer && (
        <DeleteModal onClick={(e) => e.target === e.currentTarget && setDeletingCustomer(null)}>
          <DeleteModalContent>
            <div className="icon">
              <Trash2 size={28} />
            </div>
            <h3>Mijozni o'chirish</h3>
            <p>
              <strong>{deletingCustomer.fullName}</strong> mijozini o'chirishni xohlaysizmi? 
              Bu amal qaytarib bo'lmaydi va barcha ma'lumotlar yo'qoladi.
            </p>
            <div className="buttons">
              <button className="cancel" onClick={() => setDeletingCustomer(null)}>
                Bekor qilish
              </button>
              <button className="delete" onClick={confirmDeleteCustomer}>
                Ha, o'chirish
              </button>
            </div>
          </DeleteModalContent>
        </DeleteModal>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentCustomer && (
        <PaymentModal onClick={(e) => e.target === e.currentTarget && closePaymentModal()}>
          <PaymentModalContent>
            <h3>To'lov qilish - {paymentCustomer.fullName}</h3>
            
            <div className="payment-methods">
              <div 
                className={`payment-method ${paymentMethod === 'cash' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodSelect('cash')}
              >
                <Wallet size={24} color="#10b981" />
                <div className="method-name">Naqt</div>
              </div>
              <div 
                className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => handlePaymentMethodSelect('card')}
              >
                <CreditCard size={24} color="#3b82f6" />
                <div className="method-name">Karta</div>
              </div>
            </div>

            {paymentMethod && (
              <div className="amount-input">
                <label>To'lov summasi (so'm)</label>
                <input
                  type="text"
                  placeholder="Summa kiriting..."
                  value={formatPaymentAmount(paymentAmount)}
                  onChange={handlePaymentAmountChange}
                  onWheel={(e) => e.target.blur()}
                />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '12px', 
                  color: '#64748b', 
                  marginTop: '4px',
                  gap: '16px'
                }}>
                  <div>
                    Qolgan summa: {formatCurrency(paymentCustomer.creditInfo?.remainingAmount || 0)} so'm
                  </div>
                  <div>
                    Oylik to'lov: {formatCurrency(paymentCustomer.product?.monthlyPayment || 0)} so'm
                  </div>
                </div>
              </div>
            )}

            <div className="buttons">
              <button 
                className="cancel" 
                onClick={closePaymentModal}
                disabled={paymentLoading}
              >
                Bekor qilish
              </button>
              <button 
                className="pay" 
                onClick={handlePaymentSubmit}
                disabled={paymentLoading || !paymentMethod || !paymentAmount || parseFloat(paymentAmount.replace(/\s/g, '')) <= 0}
              >
                {paymentLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}></div>
                    To'lov qilinmoqda...
                  </>
                ) : (
                  'To\'lov qilish'
                )}
              </button>
            </div>
          </PaymentModalContent>
        </PaymentModal>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <ImageModal
          images={currentImages}
          currentIndex={currentImageIndex}
          onClose={closeImageModal}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}

      {/* Calculator Modal */}
      {showCalculator && (
        <InstallmentCalculator onClose={() => setShowCalculator(false)} />
      )}

      {/* Floating Calculator Button */}
      <FloatingButton onClick={() => setShowCalculator(true)}>
        <Calculator size={24} />
      </FloatingButton>
    </PageContainer>
  );
};

export default Customers;