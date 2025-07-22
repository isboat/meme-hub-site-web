// client/src/api/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://memehubsiteapi-ekeca9fua6h9h2fy.uksouth-01.azurewebsites.net/api' //'http://localhost:5000/api';

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
    const token = localStorage.getItem('accessToken'); // Example: if your backend issues a token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (for handling token expiration/refresh)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 Unauthorized and it's not the refresh token endpoint itself
    // and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops

      const localStorageRefreshToken = localStorage.getItem('refreshToken');

      if (localStorageRefreshToken) {
        try {
          // Attempt to refresh the token
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh_token`,
            { localStorageRefreshToken }
          );

          const { accessToken, refreshToken } = refreshResponse.data;

          // Update tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // Update the original request's header with the new access token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Retry the original request
          return api(originalRequest);

        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // If refresh fails, log out the user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('memeTokenHubUserId');
          // Redirect to login page
          window.location.href = '/auth'; // Or use navigate from react-router-dom if accessible
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('memeTokenHubUserId');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;