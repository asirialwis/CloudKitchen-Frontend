// src/pages/main/Orders.jsx
import React, { useState, useEffect } from 'react';
import { fetchCustomerOrders } from '../../api-calls/ordersAPI';
import { logout } from '../../auth/auth';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchCustomerOrders();
        setOrders(data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        
        // If unauthorized, logout the user
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold">Order #{order._id.slice(-6)}</h2>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
              
              <div className="mb-2">
                <p className="text-sm text-gray-600">
                  Ordered on: {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="font-medium">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Items:</h3>
                <ul className="space-y-1">
                  {order.items.map(item => (
                    <li key={item._id} className="flex justify-between">
                      <span>Item {item.itemId.slice(-4)}</span>
                      <span>Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;