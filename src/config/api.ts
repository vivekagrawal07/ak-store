const API_URL = import.meta.env.PROD 
  ? 'https://ak-store-server.vercel.app/api'
  : 'http://localhost:5000/api';

export const getApiUrl = (endpoint: string) => `${API_URL}${endpoint}`;

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}; 