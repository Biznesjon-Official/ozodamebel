// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production by looking at the hostname
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // In production, use the same origin with /api path
    return `${window.location.origin}/api`;
  }
  
  // In development, use the configured URL or default
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Get full image URL
export const getImageUrl = (imagePath) => {
  // If no path, return null
  if (!imagePath) return null;
  
  // If it's already a data URL (Base64), return as is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // If it's a blob URL (preview), return as is
  if (imagePath.startsWith('blob:')) {
    return imagePath;
  }
  
  // If it's a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // For old file-based images (backward compatibility)
  const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3008'
    : window.location.origin;
  
  return `${baseUrl}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Create headers with auth token
  getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      timeout: 30000, // 30 second timeout
      ...options
    };

    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('❌ Non-JSON response:', text.substring(0, 200));
          throw new Error(`Server xatolik qaytardi. Status: ${response.status}`);
        }
        
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
      } catch (error) {
        retryCount++;
        
        if (error.name === 'AbortError') {
          console.error('Request timeout:', error);
          if (retryCount >= maxRetries) {
            throw new Error('So\'rov vaqti tugadi. Iltimos, qayta urinib ko\'ring.');
          }
        } else if (retryCount >= maxRetries) {
          console.error('API Error:', error);
          throw error;
        }
        
        // Retry after delay
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Guarantor methods
  async getGuarantors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/guarantors?${queryString}` : '/guarantors';
    return this.request(endpoint);
  }

  async getGuarantor(id) {
    return this.request(`/guarantors/${id}`);
  }

  async createGuarantor(guarantorData) {
    return this.request('/guarantors', {
      method: 'POST',
      body: JSON.stringify(guarantorData)
    });
  }

  async updateGuarantor(id, guarantorData) {
    return this.request(`/guarantors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(guarantorData)
    });
  }

  async deleteGuarantor(id) {
    return this.request(`/guarantors/${id}`, {
      method: 'DELETE'
    });
  }

  // Customer methods
  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/customers?${queryString}` : '/customers';
    return this.request(endpoint);
  }

  async getCustomer(id) {
    return this.request(`/customers/${id}`);
  }

  async createCustomer(customerData) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
  }

  async updateCustomer(id, customerData) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData)
    });
  }

  async updateNextPaymentDate(id, nextPaymentDate) {
    return this.request(`/customers/${id}/next-payment`, {
      method: 'PUT',
      body: JSON.stringify({ nextPaymentDate })
    });
  }

  async getCustomersDueToday() {
    return this.request('/customers/due-today');
  }

  async getCustomersDueSoon() {
    return this.request('/customers/due-soon');
  }

  async getCustomersOverdue1Day() {
    return this.request('/customers/overdue-1-day');
  }

  async getCustomersOverdue3Days() {
    return this.request('/customers/overdue-3-days');
  }

  async deleteCustomer(id) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE'
    });
  }

  // Contract methods
  async getContracts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/contracts?${queryString}` : '/contracts';
    return this.request(endpoint);
  }

  async getContract(id) {
    return this.request(`/contracts/${id}`);
  }

  async createContract(contractData) {
    return this.request('/contracts', {
      method: 'POST',
      body: JSON.stringify(contractData)
    });
  }

  async updateContract(id, contractData) {
    return this.request(`/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contractData)
    });
  }

  async deleteContract(id) {
    return this.request(`/contracts/${id}`, {
      method: 'DELETE'
    });
  }

  // Payment methods
  async getPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/payments?${queryString}` : '/payments';
    return this.request(endpoint);
  }

  async getPayment(id) {
    return this.request(`/payments/${id}`);
  }

  async createPayment(paymentData) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  async updatePayment(id, paymentData) {
    return this.request(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData)
    });
  }

  async deletePayment(id) {
    return this.request(`/payments/${id}`, {
      method: 'DELETE'
    });
  }

  // Make payment for customer
  async makePayment(customerId, paymentData) {
    return this.request(`/customers/${customerId}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  // File upload method
  async uploadFile(file, type = 'document') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = this.getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // Add type as custom header for multer destination
    headers['X-Upload-Type'] = type;

    try {
      const response = await fetch(`${this.baseURL}/upload?type=${type}`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text.substring(0, 200));
        throw new Error(`Server xatolik qaytardi. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }

      return data;
    } catch (error) {
      console.error('❌ Upload Error:', error);
      throw error;
    }
  }

  // PDF generation methods
  async generateContractPDF(customerId) {
    const token = this.getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/contracts/generate-pdf/${customerId}`, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'PDF generation failed');
      }

      // Return blob for download
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('PDF Generation Error:', error);
      throw error;
    }
  }

  // Contract generation methods
  async generateCustomerContract(customerId) {
    const token = this.getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/contracts/generate-customer/${customerId}`, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Shartnoma yaratishda xatolik');
      }

      // Return blob for download
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Contract Generation Error:', error);
      throw error;
    }
  }

  async generateGuarantorContract(customerId) {
    const token = this.getAuthToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/contracts/generate-guarantor/${customerId}`, {
        method: 'POST',
        headers
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kafil shartnomasi yaratishda xatolik');
      }

      // Return blob for download
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Guarantor Contract Generation Error:', error);
      throw error;
    }
  }

  // Notification methods
  async startTelegramBot() {
    return this.request('/notifications/start-bot', {
      method: 'POST'
    });
  }

  async getTelegramBotInfo() {
    return this.request('/telegram-bot/bot-info');
  }

  async sendTestTelegram(message) {
    return this.request('/notifications/test-telegram', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  async checkTodayPayments() {
    return this.request('/notifications/check-today', {
      method: 'POST'
    });
  }

  async checkUpcomingPayments() {
    return this.request('/notifications/check-upcoming', {
      method: 'POST'
    });
  }

  async sendDailyReport() {
    return this.request('/notifications/daily-report', {
      method: 'POST'
    });
  }
}

const apiService = new ApiService();
export default apiService;