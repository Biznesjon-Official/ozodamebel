import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Save, Edit3, Camera, Upload, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import SeasonalBackground from '../components/SeasonalBackground';

const ProfileContainer = styled.div`
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 8px 0;
  }
  
  p {
    color: #6b7280;
    margin: 0;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  h2 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const CardBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
  
  label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &:disabled {
      background-color: #f9fafb;
      color: #6b7280;
      cursor: not-allowed;
    }
  }
  
  &.password-field input {
    padding-right: 48px;
  }
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
  margin-top: 12px; /* Account for label height */
  
  &:hover {
    color: #6b7280;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }
  
  &.secondary {
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
    
    &:hover {
      border-color: #d1d5db;
      background: #f9fafb;
    }
  }
`;

const UserAvatar = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0 auto 16px;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
  overflow: hidden;
  cursor: ${props => props.$editable ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  
  &:hover {
    ${props => props.$editable && `
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
    `}
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${UserAvatar}:hover & {
    opacity: 1;
  }
`;

const AvatarUploadButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  
  svg {
    color: white;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImagePreview = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }
`;

const ClosePreviewButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  svg {
    color: white;
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  const getRoleLabel = (role) => {
    const roles = {
      admin: 'Administrator',
      operator: 'Operator',
      collector: 'Yig\'uvchi',
      auditor: 'Auditor'
    };
    return roles[role] || role;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('Rasm hajmi 5MB dan oshmasligi kerak');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    } else if (profileImage) {
      setShowImagePreview(true);
    }
  };

  const handleSave = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      showError('Yangi parollar mos kelmaydi');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      if (profileImage && profileImage !== user?.profileImage) {
        updateData.profileImage = profileImage;
      }

      await updateProfile(updateData);
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      showSuccess('Profil muvaffaqiyatli yangilandi');
    } catch (error) {
      showError('Xatolik yuz berdi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setProfileImage(user?.profileImage || null);
    setIsEditing(false);
  };

  return (
    <ProfileContainer>
      <SeasonalBackground isLogin={false} />
      <Header>
        <h1>Profil</h1>
        <p>Shaxsiy ma'lumotlaringizni boshqaring</p>
      </Header>

      <ProfileCard>
        <CardHeader>
          <UserAvatar 
            $editable={isEditing} 
            onClick={handleAvatarClick}
            title={isEditing ? "Rasm yuklash uchun bosing" : profileImage ? "Rasmni kattalashtirish" : ""}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" />
            ) : (
              getInitials(user?.fullName)
            )}
            {isEditing && (
              <>
                <AvatarOverlay>
                  <Camera size={32} color="white" />
                </AvatarOverlay>
                <AvatarUploadButton type="button">
                  <Upload size={16} />
                </AvatarUploadButton>
              </>
            )}
          </UserAvatar>
          <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>
            {user?.fullName}
          </h2>
          <div style={{ textAlign: 'center' }}>
            <RoleBadge>{getRoleLabel(user?.role)}</RoleBadge>
          </div>
        </CardHeader>

        <CardBody>
          <FormGroup>
            <label>To'liq ism</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="To'liq ismingizni kiriting"
            />
          </FormGroup>

          <FormGroup>
            <label>Telefon raqami</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Telefon raqamingizni kiriting"
            />
          </FormGroup>

          {isEditing && (
            <>
              <FormGroup className="password-field">
                <label>Joriy parol</label>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Joriy parolingizni kiriting"
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </FormGroup>

              <FormGroup className="password-field">
                <label>Yangi parol</label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Yangi parolni kiriting (ixtiyoriy)"
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </FormGroup>

              <FormGroup className="password-field">
                <label>Yangi parolni tasdiqlang</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Yangi parolni qayta kiriting"
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </FormGroup>
            </>
          )}

          <ButtonGroup>
            {!isEditing ? (
              <Button className="primary" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} />
                Tahrirlash
              </Button>
            ) : (
              <>
                <Button className="secondary" onClick={handleCancel}>
                  Bekor qilish
                </Button>
                <Button 
                  className="primary" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </Button>
              </>
            )}
          </ButtonGroup>
        </CardBody>
      </ProfileCard>

      {/* Image Preview Modal */}
      {showImagePreview && profileImage && (
        <ImagePreview onClick={() => setShowImagePreview(false)}>
          <img src={profileImage} alt="Profile Preview" />
          <ClosePreviewButton onClick={() => setShowImagePreview(false)}>
            <X size={24} />
          </ClosePreviewButton>
        </ImagePreview>
      )}
    </ProfileContainer>
  );
};

export default Profile;