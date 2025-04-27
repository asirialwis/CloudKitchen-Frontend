// src/api/ordersAPI.js
import api from '../auth/api'; 

export const fetchCustomerOrders = async () => {
  try {
    const response = await api.get('/order-service/order/user-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};




// src/api/ordersAPI.js
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.patch(
      `/order-service/order/cancel/${orderId}`,
      {}, // empty body
      {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('userId')
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Cancel error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};