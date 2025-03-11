import axios from 'axios';

const API_URL = 'https://server-git-main-vivek-agrawal-projects.vercel.app/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
  missingFields?: string[];
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      const errorResponse = error.response?.data as ErrorResponse;
      if (errorResponse?.error) {
        let errorMessage = errorResponse.error;
        if (errorResponse.details) {
          errorMessage += `: ${errorResponse.details}`;
        }
        if (errorResponse.missingFields) {
          errorMessage += `. Missing fields: ${errorResponse.missingFields.join(', ')}`;
        }
        throw new Error(errorMessage);
      }
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      const errorResponse = error.response?.data as ErrorResponse;
      if (errorResponse?.error) {
        let errorMessage = errorResponse.error;
        if (errorResponse.details) {
          errorMessage += `: ${errorResponse.details}`;
        }
        throw new Error(errorMessage);
      }
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}; 