// client/src/api/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    // Get token from Privy.io (assuming usePrivy() provides it, or you store it)
    // For Privy, typically you'd verify authentication on the backend using the privyId or by issuing your own JWT after successful Privy auth.
    // If you issue your own JWT from backend after Privy login, store it in localStorage or a more secure place (e.g., HttpOnly cookie).
    const token = localStorage.getItem('authToken'); // Example: if your backend issues a token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (e.g., token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      localStorage.removeItem('authToken');
      // window.location.href = '/auth'; // Or use react-router-dom navigate
    }
    return Promise.reject(error);
  }
);

export default api;