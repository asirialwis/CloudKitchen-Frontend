import axios from 'axios';
import { logout, isTokenExpired } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

let isRefreshing = false;
let failedRequests = [];

const processFailedRequests = (token) => {
  failedRequests.forEach((prom) => prom.resolve(token));
  failedRequests = [];
};

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      // Preemptive check for expired token
      if (isTokenExpired(token) && !config._retry) {
        if (!isRefreshing) {
          try {
            isRefreshing = true;
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post(
              'http://localhost:3000/api/auth-service/user/refresh-token',
              { refreshToken }
            );
            
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            isRefreshing = false;
            processFailedRequests(response.data.accessToken);
          } catch (error) {
            isRefreshing = false;
            logout();
            return Promise.reject(error);
          }
        } else {
          return new Promise((resolve) => {
            failedRequests.push({ resolve });
          }).then((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            return config;
          });
        }
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      // The request interceptor will handle the refresh
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;