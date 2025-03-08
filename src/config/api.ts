const API_URL = import.meta.env.PROD 
  ?"https://ak-store-vivek-agrawal-projects.vercel.app"
  : 'http://localhost:5000';

export const getApiUrl = (endpoint: string) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${path}`;
};

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 