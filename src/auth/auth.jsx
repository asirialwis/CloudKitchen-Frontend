// src/auth/auth.js
import { jwtDecode } from 'jwt-decode';
import api from './api'; // Your configured axios instance with interceptors

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  
  try {
    return !isTokenExpired(token);
  } catch {
    return false;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
};


export const signOut = async () => {
  try {
    // Call backend signout endpoint
    await api.post('/auth-service/user/signout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
}

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};