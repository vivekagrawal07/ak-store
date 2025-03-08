import axios from 'axios';
import { Product, Category, StockMovement } from '../types/inventory';

const isProd = import.meta.env.PROD;
const API_BASE_URL = isProd 
  ? 'https://ak-store-server.vercel.app'
  : 'http://localhost:5000';

console.log('Environment:', isProd ? 'production' : 'development');
console.log('API Base URL:', API_BASE_URL);

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log('Request URL:', config.baseURL + config.url);
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });
    throw error;
  }
);

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  register: async (credentials: { name: string; email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/api/auth/register', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Products API
export const productsApi = {
  getAll: (params?: { search?: string; category?: string; page?: number; limit?: number }) => 
    api.get<{ data: Product[]; total: number }>('/api/products', { params }),
  getById: (id: string) => api.get<Product>(`/api/products/${id}`),
  create: (product: Omit<Product, 'id'>) => api.post<Product>('/api/products', product),
  update: (id: string, product: Partial<Product>) => api.put<Product>(`/api/products/${id}`, product),
  delete: (id: string) => api.delete(`/api/products/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/api/categories'),
  getById: (id: string) => api.get<Category>(`/api/categories/${id}`),
  create: (category: Omit<Category, 'id'>) => api.post<Category>('/api/categories', category),
  update: (id: string, category: Partial<Category>) => api.put<Category>(`/api/categories/${id}`, category),
  delete: (id: string) => api.delete(`/api/categories/${id}`),
};

// Stock Movements API
export const stockMovementsApi = {
  getAll: () => api.get<StockMovement[]>('/api/stock-movements'),
  create: (movement: Omit<StockMovement, 'id'>) => api.post<StockMovement>('/api/stock-movements', movement),
};

export default api; 