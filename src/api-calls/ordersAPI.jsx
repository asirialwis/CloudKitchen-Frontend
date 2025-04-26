// src/api/ordersAPI.js
import api from '../auth/api'; // Your configured axios instance with interceptors

export const fetchCustomerOrders = async () => {
  try {
    const response = await api.get('/order-service/order/user-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};