import axios from 'axios';
import { Item, CreateItemDTO, UpdateQuantityDTO, UpdatePriceDTO } from '../types/inventory';

const API_URL = 'https://server-git-main-vivek-agrawal-projects.vercel.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Log token for debugging
    console.log('Token:', token);
    
    if (token && config.headers) {
      // Make sure we're using the correct format
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    // Log full request details
    console.log('Request Details:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      headers: {
        ...config.headers,
        Authorization: config.headers?.Authorization ? 
          config.headers.Authorization.substring(0, 20) + '...' : 
          'No token'
      },
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response Success:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response Error Details:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      error: error.response?.data?.error || error.message,
      fullError: error.response?.data || error
    });

    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error('Please login to continue'));
    }

    // Return the error message from the API if available
    if (error.response?.data?.error) {
      return Promise.reject(new Error(error.response.data.error));
    }

    return Promise.reject(error);
  }
);

export const itemsApi = {
  // Get all items for the logged-in user
  getAll: async (): Promise<Item[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const { data } = await api.get<Item[]>('/items');
      return data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get single item
  getById: async (id: number): Promise<Item> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const { data } = await api.get<Item>(`/items/${id}`);
      return data;
    } catch (error: any) {
      throw error;
    }
  },

  // Create new item
  create: async (item: CreateItemDTO): Promise<Item> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const { data } = await api.post<Item>('/items', item);
      return data;
    } catch (error: any) {
      throw error;
    }
  },

  // Update quantity
  updateQuantity: async (id: number, dto: UpdateQuantityDTO): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await api.patch(`/items/${id}/quantity`, dto);
    } catch (error: any) {
      throw error;
    }
  },

  // Update price
  updatePrice: async (id: number, dto: UpdatePriceDTO): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await api.patch(`/items/${id}/price`, dto);
    } catch (error: any) {
      throw error;
    }
  },

  // Delete item
  delete: async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await api.delete(`/items/${id}`);
    } catch (error: any) {
      throw error;
    }
  }
}; 