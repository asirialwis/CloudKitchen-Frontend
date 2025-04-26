export const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
  };
  
  export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
  };