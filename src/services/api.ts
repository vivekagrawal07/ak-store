import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { Product, Category, StockMovement } from '../types/inventory';

const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_PROD_API_URL
  : import.meta.env.VITE_API_URL;

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

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
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