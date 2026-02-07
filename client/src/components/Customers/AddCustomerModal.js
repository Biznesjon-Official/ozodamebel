import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Upload,
  User,
  Users,
  Package,
  Check,
  Camera
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import apiService from '../../services/api';
import { formatCurrency, formatPhoneInput, formatCurrencyInput, parseCurrency, validatePhoneNumber, formatPassportInput, validatePassport } from '../../utils/formatters';
import { regionsList, getDistricts } from '../../data/regions';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #6c757d;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #495057;
  }
`;

const StepperContainer = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
`;

const Stepper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 40px;
    right: 40px;
    height: 2px;
    background: #e9ecef;
    z-index: 1;
  }
`;

const StepperProgress = styled.div`
  position: absolute;
  top: 20px;
  left: 40px;
  height: 2px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  z-index: 2;
  transition: width 0.3s ease;
  width: ${props => (props.$currentStep - 1) * 33.33}%;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 3;
  
  .step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    
    ${props => props.$active ? `
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
    ` : props.$completed ? `
      background: linear-gradient(135deg, #27ae60, #2ecc71);
      color: white;
    ` : `
      background: white;
      color: #6c757d;
      border: 2px solid #e9ecef;
    `}
  }
  
  .step-label {
    font-size: 12px;
    font-weight: 500;
    color: ${props => props.$active || props.$completed ? '#2c3e50' : '#6c757d'};
    text-align: center;
    max-width: 80px;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
`;

const ModalFooter = styled.div`
  padding: 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  flex-shrink: 0;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.primary {
    background: linear-gradient(135deg, #3498db, #2980b9);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
  
  &.secondary {
    background: white;
    color: #6c757d;
    border: 2px solid #e9ecef;
    
    &:hover {
      border-color: #3498db;
      color: #3498db;
    }
  }
`;

// Step 1: Image Upload
const ImageUploadContainer = styled.div`
  text-align: center;
`;

// Multiple Image Previews
const ImagePreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  flex-shrink: 0;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  
  &:hover {
    background: rgba(231, 76, 60, 1);
  }
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #e9ecef;
  border-radius: 12px;
  padding: 40px 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.05);
  }
  
  &.dragover {
    border-color: #3498db;
    background: rgba(52, 152, 219, 0.1);
  }
`;

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

// Form Components
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
  
  &.error {
    border-color: #e74c3c;
  }
  
  /* Prevent scroll wheel from changing number input values */
  &[type="number"] {
    -moz-appearance: textfield;
  }
  
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
  
  &.error {
    border-color: #e74c3c;
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
`;

const SkipButton = styled.button`
  background: none;
  border: 2px solid #e9ecef;
  color: #6c757d;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3498db;
    color: #3498db;
  }
`;

// Step 4: Product calculation
const CalculationContainer = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const CalculationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
    font-weight: 600;
    font-size: 16px;
    color: #2c3e50;
  }
`;

const AddCustomerModal = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [customerPhoneValue, setCustomerPhoneValue] = useState('');
  const [guarantorPhoneValue, setGuarantorPhoneValue] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  // Passport states
  const [customerPassportValue, setCustomerPassportValue] = useState('');
  const [guarantorPassportValue, setGuarantorPassportValue] = useState('');
  
  // Region and district states
  const [customerRegion, setCustomerRegion] = useState('');
  const [customerDistricts, setCustomerDistricts] = useState([]);
  const [guarantorRegion, setGuarantorRegion] = useState('');
  const [guarantorDistricts, setGuarantorDistricts] = useState([]);
  
  // Currency formatting states
  const [originalPriceValue, setOriginalPriceValue] = useState('');
  const [initialPaymentValue, setInitialPaymentValue] = useState('');
  const [markupAmountValue, setMarkupAmountValue] = useState(''); // Ustama so'mda
  const [markupType, setMarkupType] = useState('percent'); // 'percent' yoki 'amount'
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const steps = [
    { id: 1, label: 'Rasm yuklash', icon: Camera },
    { id: 2, label: 'Mijoz ma\'lumotlari', icon: User },
    { id: 3, label: 'Kafil ma\'lumotlari', icon: Users },
    { id: 4, label: 'Mahsulot ma\'lumotlari', icon: Package }
  ];

  // Register phone fields for validation
  useEffect(() => {
    register('customerPhone', { 
      required: 'Mijoz telefon raqami majburiy',
      validate: {
        length: value => value && value.length === 9 || 'Telefon raqam 9 ta raqamdan iborat bo\'lishi kerak'
      }
    });
    register('guarantorPhone', { 
      required: 'Kafil telefon raqami majburiy',
      validate: {
        length: value => value && value.length === 9 || 'Telefon raqam 9 ta raqamdan iborat bo\'lishi kerak'
      }
    });
    register('originalPrice', {
      required: 'Asl narx majburiy',
      validate: value => parseCurrency(originalPriceValue) > 0 || 'Asl narx 0 dan katta bo\'lishi kerak'
    });
  }, [register, originalPriceValue]);

  // Clear browser auto-fill when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      // Force clear any auto-filled values
      const inputs = document.querySelectorAll('input[data-form-type="other"]');
      inputs.forEach(input => {
        if (input.value && !input.dataset.userInput) {
          input.value = '';
        }
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Watch form values for calculations
  const originalPrice = parseCurrency(originalPriceValue) || 0;
  const profitPercentage = watch('profitPercentage') || 0;
  const markupAmount = parseCurrency(markupAmountValue) || 0;
  const installmentMonths = watch('installmentMonths') || 1;
  const initialPayment = parseCurrency(initialPaymentValue) || 0;

  // Calculate selling price based on markup type
  let sellingPrice = originalPrice;
  let actualMarkup = 0;
  
  if (markupType === 'percent' && profitPercentage > 0) {
    actualMarkup = originalPrice * profitPercentage / 100;
    sellingPrice = originalPrice + actualMarkup;
  } else if (markupType === 'amount' && markupAmount > 0) {
    actualMarkup = markupAmount;
    sellingPrice = originalPrice + actualMarkup;
  }
  
  const remainingAmount = sellingPrice - initialPayment;
  const monthlyPayment = remainingAmount / installmentMonths;

  // Phone number formatting function
  // Handle customer phone input change
  const handleCustomerPhoneChange = (e) => {
    e.target.dataset.userInput = 'true';
    const formatted = formatPhoneInput(e.target.value);
    setCustomerPhoneValue(formatted);
    
    // Set the raw digits for form validation
    const rawDigits = formatted.replace(/\D/g, '');
    setValue('customerPhone', rawDigits);
  };

  // Handle guarantor phone input change
  const handleGuarantorPhoneChange = (e) => {
    e.target.dataset.userInput = 'true';
    const formatted = formatPhoneInput(e.target.value);
    setGuarantorPhoneValue(formatted);
    
    // Set the raw digits for form validation
    const rawDigits = formatted.replace(/\D/g, '');
    setValue('guarantorPhone', rawDigits);
  };

  // Handle region changes
  const handleCustomerRegionChange = (e) => {
    const region = e.target.value;
    setCustomerRegion(region);
    setCustomerDistricts(getDistricts(region));
    setValue('customerRegion', region);
    setValue('customerDistrict', ''); // Reset district when region changes
  };

  const handleGuarantorRegionChange = (e) => {
    const region = e.target.value;
    setGuarantorRegion(region);
    setGuarantorDistricts(getDistricts(region));
    setValue('guarantorRegion', region);
    setValue('guarantorDistrict', ''); // Reset district when region changes
  };

  // Handle currency input changes
  const handleOriginalPriceChange = (e) => {
    const formatted = formatCurrencyInput(e.target.value);
    setOriginalPriceValue(formatted);
    setValue('originalPrice', parseCurrency(formatted));
  };

  const handleInitialPaymentChange = (e) => {
    const formatted = formatCurrencyInput(e.target.value);
    setInitialPaymentValue(formatted);
  };

  const handleMarkupAmountChange = (e) => {
    const formatted = formatCurrencyInput(e.target.value);
    setMarkupAmountValue(formatted);
  };

  // Handle passport input changes
  const handleCustomerPassportChange = (e) => {
    const formatted = formatPassportInput(e.target.value);
    setCustomerPassportValue(formatted);
    setValue('customerPassport', formatted);
  };

  const handleGuarantorPassportChange = (e) => {
    const formatted = formatPassportInput(e.target.value);
    setGuarantorPassportValue(formatted);
    setValue('guarantorPassport', formatted);
  };

  // Prevent wheel scroll on number inputs
  const handleWheelPrevent = (e) => {
    e.target.blur();
  };

  const handleImageUpload = async (files) => {
    console.log('📤 handleImageUpload called');
    console.log('📤 Files received:', files);
    console.log('📤 Files type:', typeof files);
    console.log('📤 Files length:', files?.length);
    
    const fileArray = Array.from(files);
    console.log('📤 File array:', fileArray);
    console.log('📤 File array length:', fileArray.length);
    
    const validImages = fileArray.filter(file => {
      const isValid = file.type.startsWith('image/');
      console.log(`📤 File ${file.name}: type=${file.type}, valid=${isValid}`);
      return isValid;
    });
    console.log('📤 Valid images:', validImages);
    console.log('📤 Valid images count:', validImages.length);
    
    if (validImages.length > 0) {
      // Barcha rasmlarni yuklab, preview yaratish
      const newPreviews = [];
      
      for (const file of validImages) {
        try {
          console.log('📤 Reading file:', file.name);
          const preview = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              console.log('✅ File read successfully:', file.name);
              resolve(e.target.result);
            };
            reader.onerror = (e) => {
              console.error('❌ Error reading file:', file.name, e);
              reject(e);
            };
            reader.readAsDataURL(file);
          });
          newPreviews.push(preview);
        } catch (error) {
          console.error('❌ Error reading file:', error);
          alert(`Rasmni o'qishda xatolik: ${file.name}`);
        }
      }
      
      // Barcha rasmlar yuklanganidan keyin state'ni yangilash
      console.log('📤 Adding', validImages.length, 'images to state');
      setUploadedImages(prev => {
        const updated = [...prev, ...validImages];
        console.log('📤 Updated uploadedImages:', updated.length);
        return updated;
      });
      setImagePreviews(prev => {
        const updated = [...prev, ...newPreviews];
        console.log('📤 Updated imagePreviews:', updated.length);
        return updated;
      });
      
      console.log('✅ Images successfully added!');
    } else {
      console.log('❌ No valid images found');
      alert('Hech qanday to\'g\'ri rasm topilmadi. Iltimos, rasm faylini tanlang.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    console.log('Files dropped:', e.dataTransfer.files);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(files);
    } else {
      console.log('No files dropped');
    }
  };

  const handleFileSelect = (e) => {
    console.log('📸 File input changed');
    console.log('📸 Event target:', e.target.id);
    console.log('📸 Files:', e.target.files);
    console.log('📸 Files length:', e.target.files?.length);
    
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log('📸 Processing', files.length, 'files');
      // Log each file details
      Array.from(files).forEach((file, index) => {
        console.log(`📸 File ${index + 1}:`, {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified
        });
      });
      handleImageUpload(files);
    } else {
      console.log('❌ No files selected');
      alert('Rasm tanlanmadi. Iltimos, qaytadan urinib ko\'ring.');
    }
    // Reset input value to allow selecting same file again
    e.target.value = '';
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Kamera funksiyalari
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Kamera ochishda xatolik:', error);
      alert('Kamera ochishda xatolik. Iltimos, brauzerga kamera ruxsatini bering.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleImageUpload([file]);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  // Cleanup kamera on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        // Step 1 is optional (image upload)
        return true;
        
      case 2:
        // Step 2: Customer info validation
        const customerName = watch('customerName');
        return customerName && customerName.trim() !== '' && 
               customerPhoneValue && customerPhoneValue.replace(/\D/g, '').length === 9;
        
      case 3:
        // Step 3: Guarantor info validation
        const guarantorName = watch('guarantorName');
        return guarantorName && guarantorName.trim() !== '' && 
               guarantorPhoneValue && guarantorPhoneValue.replace(/\D/g, '').length === 9;
        
      case 4:
        // Step 4: Product info validation
        const productName = watch('productName');
        const profitPercentage = watch('profitPercentage');
        const hasValidMarkup = markupType === 'percent' 
          ? (profitPercentage && profitPercentage > 0)
          : (markupAmount && markupAmount > 0);
        
        return productName && productName.trim() !== '' && 
               originalPrice > 0 && 
               hasValidMarkup &&
               installmentMonths > 0;
        
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Check if current step is valid for button state
  const isCurrentStepValid = validateCurrentStep();

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Upload images first if exist
      let imageUrls = [];
      if (uploadedImages.length > 0) {
        console.log('📤 Starting image upload for', uploadedImages.length, 'images');
        console.log('📤 Uploaded images:', uploadedImages);
        for (const image of uploadedImages) {
          console.log('📤 Uploading image:', image.name, 'Type:', image.type, 'Size:', image.size);
          
          // Ensure image is a proper File object
          let fileToUpload = image;
          if (!(image instanceof File)) {
            console.log('📤 Converting to File object');
            fileToUpload = new File([image], image.name || `camera-${Date.now()}.jpg`, { 
              type: image.type || 'image/jpeg' 
            });
          }
          
          try {
            console.log('📤 Uploading file:', fileToUpload.name, 'Type:', fileToUpload.type, 'Size:', fileToUpload.size);
            const imageResponse = await apiService.uploadFile(fileToUpload, 'profile');
            console.log('📤 Upload response:', imageResponse);
            if (imageResponse.success) {
              // Use file.url or url from response
              const imageUrl = imageResponse.file?.url || imageResponse.url || imageResponse.filePath;
              console.log('📤 Image URL:', imageUrl);
              if (imageUrl) {
                imageUrls.push(imageUrl);
                console.log('✅ Image added to URLs array:', imageUrl);
              } else {
                console.error('❌ No URL found in response:', imageResponse);
                alert('Rasm URL topilmadi. Iltimos, qaytadan urinib ko\'ring.');
              }
            } else {
              console.error('❌ Upload failed:', imageResponse);
              alert(`Rasm yuklashda xatolik: ${imageResponse.message || 'Noma\'lum xatolik'}`);
            }
          } catch (error) {
            console.error('📤 Upload error for image:', fileToUpload.name, error);
            alert(`Rasm yuklashda xatolik: ${error.message}`);
          }
        }
        console.log('📤 Final image URLs:', imageUrls);
      } else {
        console.log('📤 No images to upload');
      }

      // Prepare customer data
      const customerData = {
        // Customer info
        fullName: data.customerName,
        phone: data.customerPhone,
        birthDate: data.customerBirthDate,
        region: data.customerRegion,
        district: data.customerDistrict,
        address: data.customerAddress,
        houseNumber: data.customerHouseNumber,
        passportSeries: data.customerPassport,
        profileImages: imageUrls,
        
        // Guarantor info
        guarantorName: data.guarantorName,
        guarantorPhone: data.guarantorPhone,
        guarantorBirthDate: data.guarantorBirthDate,
        guarantorRegion: data.guarantorRegion,
        guarantorDistrict: data.guarantorDistrict,
        guarantorAddress: data.guarantorAddress,
        guarantorHouseNumber: data.guarantorHouseNumber,
        guarantorPassport: data.guarantorPassport,
        
        // Product info
        productName: data.productName,
        originalPrice: parseCurrency(originalPriceValue),
        profitPercentage: markupType === 'percent' ? parseFloat(data.profitPercentage || 0) : 0,
        markupAmount: markupType === 'amount' ? markupAmount : 0,
        markupType: markupType,
        sellingPrice: sellingPrice,
        installmentMonths: parseInt(data.installmentMonths),
        monthlyPayment: monthlyPayment,
        initialPayment: parseCurrency(initialPaymentValue),
        nextPaymentDate: data.nextPaymentDate || null
      };

      console.log('📤 Sending customer data with images:', customerData.profileImages);
      const response = await apiService.createCustomer(customerData);
      
      if (response.success) {
        onSuccess();
      } else {
        throw new Error(response.message || 'Mijoz qo\'shishda xatolik');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Mijoz qo\'shishda xatolik: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ImageUploadContainer>
            <h3>Mijoz rasmlarini yuklang</h3>
            <p>Mijozning shaxsiy rasmlarini yuklang (ixtiyoriy)</p>
            
            {imagePreviews.length > 0 && (
              <ImagePreviewGrid>
                {imagePreviews.map((preview, index) => (
                  <ImagePreviewItem key={index}>
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <RemoveImageButton onClick={() => removeImage(index)}>
                      <X size={12} />
                    </RemoveImageButton>
                  </ImagePreviewItem>
                ))}
              </ImagePreviewGrid>
            )}
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
              <Button
                type="button"
                className="primary"
                onClick={() => document.getElementById('imageInput').click()}
                style={{ flex: 1, maxWidth: '200px' }}
              >
                <Upload size={20} />
                Galereyadan tanlash
              </Button>
              
              <Button
                type="button"
                className="primary"
                onClick={() => {
                  // Mobil qurilmalarni aniqlash
                  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                  
                  if (isMobile || hasTouch) {
                    // Mobilda to'g'ridan-to'g'ri kamera ochiladi
                    document.getElementById('cameraInput').click();
                  } else {
                    // Desktop/noutbukda video stream
                    startCamera();
                  }
                }}
                style={{ flex: 1, maxWidth: '200px' }}
              >
                <Camera size={20} />
                Kameradan olish
              </Button>
            </div>
            
            {showCamera && (
              <CameraContainer>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '500px', borderRadius: '8px' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'center' }}>
                  <Button type="button" className="primary" onClick={capturePhoto}>
                    Rasm olish
                  </Button>
                  <Button type="button" className="secondary" onClick={stopCamera}>
                    Bekor qilish
                  </Button>
                </div>
              </CameraContainer>
            )}
            
            <ImageUploadArea
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
            >
              <Upload size={48} color="#3498db" />
              <h4>Yoki rasmlarni shu yerga sudrab oling</h4>
              <p style={{ fontSize: '12px', color: '#6c757d' }}>
                Bir nechta rasm tanlashingiz mumkin
              </p>
            </ImageUploadArea>
            
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            {/* Mobil qurilmalar uchun kamera input */}
            <input
              id="cameraInput"
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
              {imagePreviews.length > 0 && (
                <Button 
                  type="button" 
                  className="secondary"
                  onClick={() => {
                    setImagePreviews([]);
                    setUploadedImages([]);
                  }}
                >
                  Barcha rasmlarni o'chirish
                </Button>
              )}
              
              <SkipButton onClick={nextStep}>
                O'tkazib yuborish
              </SkipButton>
            </div>
          </ImageUploadContainer>
        );

      case 2:
        return (
          <div>
            <h3>Mijoz ma'lumotlari</h3>
            <FormGrid>
              <FormGroup>
                <Label>Mijoz ismi *</Label>
                <Input
                  {...register('customerName', { required: 'Mijoz ismi majburiy' })}
                  placeholder="To'liq ism"
                  className={errors.customerName ? 'error' : ''}
                  autoComplete="new-password"
                  data-form-type="other"
                />
                {errors.customerName && <ErrorMessage>{errors.customerName.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Telefon raqam *</Label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6c757d',
                    fontSize: '14px',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>+998</span>
                  <Input
                    value={customerPhoneValue}
                    onChange={handleCustomerPhoneChange}
                    placeholder="90 123 45 67"
                    style={{ paddingLeft: '70px' }}
                    className={errors.customerPhone ? 'error' : ''}
                    autoComplete="new-password"
                    data-form-type="other"
                  />
                </div>
                {errors.customerPhone && <ErrorMessage>{errors.customerPhone.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Tug'ilgan sana</Label>
                <Input
                  type="date"
                  {...register('customerBirthDate')}
                  autoComplete="new-password"
                  data-form-type="other"
                />
              </FormGroup>

              <FormGroup>
                <Label>Viloyat</Label>
                <Select 
                  value={customerRegion}
                  onChange={handleCustomerRegionChange}
                >
                  <option value="">Viloyatni tanlang</option>
                  {regionsList.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Tuman</Label>
                <Select 
                  {...register('customerDistrict')}
                  disabled={!customerRegion}
                >
                  <option value="">Tumanni tanlang</option>
                  {customerDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Uy manzili</Label>
                <Input
                  {...register('customerAddress')}
                  placeholder="Ko'cha nomi, uy raqami"
                  autoComplete="new-password"
                  data-form-type="other"
                />
              </FormGroup>

              <FormGroup>
                <Label>Uy raqami</Label>
                <Input
                  {...register('customerHouseNumber')}
                  placeholder="Uy raqami"
                  autoComplete="new-password"
                  data-form-type="other"
                />
              </FormGroup>

              <FormGroup>
                <Label>Pasport seriyasi</Label>
                <Input
                  value={customerPassportValue}
                  onChange={handleCustomerPassportChange}
                  placeholder="AA 1234567"
                  autoComplete="new-password"
                  data-form-type="other"
                  maxLength={10}
                />
              </FormGroup>
            </FormGrid>
          </div>
        );

      case 3:
        return (
          <div>
            <h3>Kafil ma'lumotlari</h3>
            <FormGrid>
              <FormGroup>
                <Label>Kafil ismi *</Label>
                <Input
                  {...register('guarantorName', { required: 'Kafil ismi majburiy' })}
                  placeholder="To'liq ism"
                  className={errors.guarantorName ? 'error' : ''}
                  autoComplete="new-password"
                  data-form-type="other"
                />
                {errors.guarantorName && <ErrorMessage>{errors.guarantorName.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Telefon raqam *</Label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6c757d',
                    fontSize: '14px',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}>+998</span>
                  <Input
                    value={guarantorPhoneValue}
                    onChange={handleGuarantorPhoneChange}
                    placeholder="90 123 45 67"
                    style={{ paddingLeft: '70px' }}
                    className={errors.guarantorPhone ? 'error' : ''}
                    autoComplete="new-password"
                    data-form-type="other"
                  />
                </div>
                {errors.guarantorPhone && <ErrorMessage>{errors.guarantorPhone.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Tug'ilgan sana</Label>
                <Input
                  type="date"
                  {...register('guarantorBirthDate')}
                  autoComplete="new-password"
                  data-form-type="other"
                />
              </FormGroup>

              <FormGroup>
                <Label>Viloyat</Label>
                <Select 
                  value={guarantorRegion}
                  onChange={handleGuarantorRegionChange}
                >
                  <option value="">Viloyatni tanlang</option>
                  {regionsList.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Tuman</Label>
                <Select 
                  {...register('guarantorDistrict')}
                  disabled={!guarantorRegion}
                >
                  <option value="">Tumanni tanlang</option>
                  {guarantorDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Uy manzili</Label>
                <Input
                  {...register('guarantorAddress')}
                  placeholder="Ko'cha nomi, uy raqami"
                  autoComplete="new-password"
                  data-form-type="other"
                />
              </FormGroup>

              <FormGroup>
                <Label>Uy raqami</Label>
                <Input
                  {...register('guarantorHouseNumber')}
                  placeholder="Uy raqami"
                  autoComplete="new-password"
                  data-form-type="other"
                />
              </FormGroup>

              <FormGroup>
                <Label>Pasport seriyasi</Label>
                <Input
                  value={guarantorPassportValue}
                  onChange={handleGuarantorPassportChange}
                  placeholder="AA 1234567"
                  autoComplete="new-password"
                  data-form-type="other"
                  maxLength={10}
                />
              </FormGroup>
            </FormGrid>
          </div>
        );

      case 4:
        return (
          <div>
            <h3>Mahsulot ma'lumotlari</h3>
            <FormGrid>
              <FormGroup>
                <Label>Mahsulot(lar) nomi *</Label>
                <Input
                  {...register('productName', { required: 'Mahsulot nomi majburiy' })}
                  placeholder="Masalan: Divan, Kreslo, Stol"
                  className={errors.productName ? 'error' : ''}
                  autoComplete="new-password"
                  data-form-type="other"
                />
                <span style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  Bir nechta mahsulot bo'lsa, vergul bilan ajrating
                </span>
                {errors.productName && <ErrorMessage>{errors.productName.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Asl narxi (so'm) *</Label>
                <Input
                  value={originalPriceValue}
                  onChange={handleOriginalPriceChange}
                  placeholder="0"
                  className={errors.originalPrice ? 'error' : ''}
                  autoComplete="new-password"
                  data-form-type="other"
                />
                {errors.originalPrice && <ErrorMessage>{errors.originalPrice.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Ustama turi *</Label>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMarkupType('percent');
                      setMarkupAmountValue('');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: markupType === 'percent' ? '2px solid #3498db' : '2px solid #e9ecef',
                      borderRadius: '8px',
                      background: markupType === 'percent' ? '#e3f2fd' : 'white',
                      cursor: 'pointer',
                      fontWeight: markupType === 'percent' ? 'bold' : 'normal',
                      color: markupType === 'percent' ? '#3498db' : '#666'
                    }}
                  >
                    Foizda (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMarkupType('amount');
                      setValue('profitPercentage', '');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: markupType === 'amount' ? '2px solid #3498db' : '2px solid #e9ecef',
                      borderRadius: '8px',
                      background: markupType === 'amount' ? '#e3f2fd' : 'white',
                      cursor: 'pointer',
                      fontWeight: markupType === 'amount' ? 'bold' : 'normal',
                      color: markupType === 'amount' ? '#3498db' : '#666'
                    }}
                  >
                    So'mda
                  </button>
                </div>
                
                {markupType === 'percent' ? (
                  <>
                    <Label>Ustama (%) *</Label>
                    <Input
                      type="number"
                      {...register('profitPercentage', { required: markupType === 'percent' ? 'Ustama majburiy' : false })}
                      placeholder="20"
                      className={errors.profitPercentage ? 'error' : ''}
                      onWheel={handleWheelPrevent}
                      autoComplete="new-password"
                      data-form-type="other"
                    />
                    {errors.profitPercentage && <ErrorMessage>{errors.profitPercentage.message}</ErrorMessage>}
                  </>
                ) : (
                  <>
                    <Label>Ustama (so'm) *</Label>
                    <Input
                      value={markupAmountValue}
                      onChange={handleMarkupAmountChange}
                      placeholder="0"
                      autoComplete="new-password"
                      data-form-type="other"
                    />
                    {markupAmountValue === '' && <ErrorMessage>Ustama majburiy</ErrorMessage>}
                  </>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Necha oyga bo'lib berish *</Label>
                <Input
                  type="number"
                  {...register('installmentMonths', { required: 'Oy soni majburiy' })}
                  placeholder="Masalan: 12"
                  className={errors.installmentMonths ? 'error' : ''}
                  onWheel={handleWheelPrevent}
                  autoComplete="new-password"
                  data-form-type="other"
                  min="1"
                  max="60"
                />
                {errors.installmentMonths && <ErrorMessage>{errors.installmentMonths.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label>Boshlang'ich to'lov (so'm)</Label>
                <Input
                  value={initialPaymentValue}
                  onChange={handleInitialPaymentChange}
                  placeholder="0"
                  autoComplete="new-password"
                  data-form-type="other"
                />
              </FormGroup>

              <FormGroup>
                <Label>Keyingi to'lov sanasi</Label>
                <Input
                  type="date"
                  {...register('nextPaymentDate')}
                  autoComplete="new-password"
                  data-form-type="other"
                />
                <span style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  Agar kiritilmasa, avtomatik 1 oy keyingi sana bo'ladi
                </span>
              </FormGroup>
            </FormGrid>

            {originalPrice > 0 && (profitPercentage > 0 || markupAmount > 0) && installmentMonths > 0 && (
              <CalculationContainer>
                <h4>Hisob-kitob</h4>
                <CalculationRow>
                  <span>Asl narx:</span>
                  <span>{formatCurrency(originalPrice)} so'm</span>
                </CalculationRow>
                <CalculationRow>
                  <span>Ustama {markupType === 'percent' ? `(${profitPercentage}%)` : ''}:</span>
                  <span>{formatCurrency(actualMarkup)} so'm</span>
                </CalculationRow>
                <CalculationRow>
                  <span>Sotiladigan narx:</span>
                  <span>{formatCurrency(sellingPrice)} so'm</span>
                </CalculationRow>
                {initialPayment > 0 && (
                  <CalculationRow>
                    <span>Boshlang'ich to'lov:</span>
                    <span>{formatCurrency(initialPayment)} so'm</span>
                  </CalculationRow>
                )}
                <CalculationRow>
                  <span>Qolgan summa:</span>
                  <span>{formatCurrency(remainingAmount)} so'm</span>
                </CalculationRow>
                <CalculationRow>
                  <span>Oylik to'lov ({installmentMonths} oy):</span>
                  <span>{formatCurrency(monthlyPayment)} so'm</span>
                </CalculationRow>
              </CalculationContainer>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Yangi mijoz qo'shish</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <StepperContainer>
          <Stepper>
            <StepperProgress $currentStep={currentStep} />
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Step
                  key={step.id}
                  $active={currentStep === step.id}
                  $completed={currentStep > step.id}
                >
                  <div className="step-circle">
                    {currentStep > step.id ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <div className="step-label">{step.label}</div>
                </Step>
              );
            })}
          </Stepper>
        </StepperContainer>

        <ModalBody>
          <form autoComplete="off" data-form-type="other">
            {renderStepContent()}
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            className="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft size={16} />
            Orqaga
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              className="primary"
              onClick={nextStep}
              disabled={!isCurrentStepValid}
            >
              Keyingi
              <ArrowRight size={16} />
            </Button>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'inline' }}>
              <Button
                type="submit"
                className="primary"
                disabled={loading}
              >
                {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                <Check size={16} />
              </Button>
            </form>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddCustomerModal;