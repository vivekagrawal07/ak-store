import axios from 'axios';
import { Product, Category, StockMovement, Item, CreateItemDTO, UpdateItemDTO } from '../types/inventory';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = 'https://server-git-main-vivek-agrawal-projects.vercel.app/api';

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
  withCredentials: false
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
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  register: async (credentials: { name: string; email: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
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

// Items API endpoints
export const itemsApi = {
  // Get all items
  getAll: async (): Promise<Item[]> => {
    const response = await api.get('/items');
    return response.data.map((item: any) => ({
      ...item,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    }));
  },

  // Get single item by ID
  getById: async (id: number): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    const item = response.data;
    return {
      ...item,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    };
  },

  // Create new item
  create: async (data: CreateItemDTO): Promise<Item> => {
    // Validate input before sending
    if (!data.name || typeof data.quantity !== 'number' || typeof data.price !== 'number') {
      throw new Error('Name, quantity, and price are required');
    }
    if (data.quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }
    if (data.price < 0) {
      throw new Error('Price cannot be negative');
    }

    const response = await api.post('/items', data);
    const item = response.data;
    return {
      ...item,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity)
    };
  },

  // Update item quantity
  updateQuantity: async (id: number, quantity: number): Promise<void> => {
    if (typeof quantity !== 'number' || quantity < 0) {
      throw new Error('Valid quantity is required');
    }
    await api.patch(`/items/${id}/quantity`, { quantity });
  },

  // Update item price
  updatePrice: async (id: number, price: number): Promise<void> => {
    if (typeof price !== 'number' || price < 0) {
      throw new Error('Valid price is required');
    }
    await api.patch(`/items/${id}/price`, { price });
  }
};

// React Query Hooks for Items
export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: itemsApi.getAll,
  });
};

export const useItem = (id: number) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItemQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => 
      itemsApi.updateQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItemPrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, price }: { id: number; price: number }) => 
      itemsApi.updatePrice(id, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export default api; 