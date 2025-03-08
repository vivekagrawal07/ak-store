import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { Product, Category, StockMovement } from '../types/inventory';

const isProd = import.meta.env.PROD;
const API_BASE_URL = isProd 
  ? (import.meta.env.VITE_PROD_API_URL || 'https://ak-store-server.vercel.app/api')
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

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
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status);
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
        baseURL: error.config?.baseURL
      }
    });
    throw error;
  }
);

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response;
  },
  register: async (credentials: { name: string; email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
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
    api.get<{ data: Product[]; total: number }>('/products', { params }),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (product: Omit<Product, 'id'>) => api.post<Product>('/products', product),
  update: (id: string, product: Partial<Product>) => api.put<Product>(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (category: Omit<Category, 'id'>) => api.post<Category>('/categories', category),
  update: (id: string, category: Partial<Category>) => api.put<Category>(`/categories/${id}`, category),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Stock Movements API
export const stockMovementsApi = {
  getAll: () => api.get<StockMovement[]>('/stock-movements'),
  create: (movement: Omit<StockMovement, 'id'>) => api.post<StockMovement>('/stock-movements', movement),
};

export default api; 