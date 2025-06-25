import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth-token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    if (token) {
      localStorage.setItem('auth-token', token);
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('auth-token');
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    
    const response = await this.api.post('/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    this.setAuthToken(response.data.access_token);
    return response.data;
  }

  async register(userData: any) {
    const response = await this.api.post('/register', userData);
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.api.get('/me');
    return response.data;
  }

  // Countries endpoints
  async getCountries() {
    const response = await this.api.get('/countries');
    return response.data;
  }

  async getCountryProducts(countryId: string) {
    const response = await this.api.get(`/countries/${countryId}/products`);
    return response.data;
  }

  // Products endpoints
  async getProducts(params?: { search?: string; category?: string }) {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  async createProduct(productData: any) {
    const response = await this.api.post('/products', productData);
    return response.data;
  }

  async updateProduct(productId: string, productData: any) {
    const response = await this.api.put(`/products/${productId}`, productData);
    return response.data;
  }

  async deleteProduct(productId: string) {
    const response = await this.api.delete(`/products/${productId}`);
    return response.data;
  }

  // Exporters endpoints
  async getExporters(countryId?: string) {
    const params = countryId ? { country_id: countryId } : {};
    const response = await this.api.get('/exporters', { params });
    return response.data;
  }

  async createExporter(exporterData: any) {
    const response = await this.api.post('/exporters', exporterData);
    return response.data;
  }

  // Admin endpoints
  async getAllUsers() {
    const response = await this.api.get('/admin/users');
    return response.data;
  }

  async activateUser(userId: string) {
    const response = await this.api.patch(`/admin/users/${userId}/activate`);
    return response.data;
  }

  async getAuditLogs() {
    const response = await this.api.get('/admin/audit-logs');
    return response.data;
  }
}

export const apiService = new ApiService();