import React, { useState, useEffect } from 'react';
import { fetchCustomerOrders } from '../../api-calls/ordersAPI';
import { logout } from '../../auth/auth';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
  preparing: 'bg-blue-100 text-blue-800',
  'searching-drivers': 'bg-purple-100 text-purple-800',
  'on-the-way': 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800'
};

const statusIcons = {
  preparing: '👨‍🍳',
  'searching-drivers': '🚗',
  'on-the-way': '🏍️',
  delivered: '✅',
  cancelled: '❌',
  pending: '⏳'
};

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
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

//   const handleCancelOrder = async (orderId) => {
//     try {
//       await cancelOrder(orderId);
//       setOrders(orders.map(order => 
//         order._id === orderId ? { ...order, status: 'cancelled' } : order
//       ));
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to cancel order');
//     }
//   };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p>{error}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Orders</h1>
      
      <AnimatePresence>
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-lg p-8 text-center"
          >
            <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </h2>
                      {order.restaurantId && (
                        <p className="text-gray-600 mt-1">
                          From: {order.restaurantId.name}
                        </p>
                      )}
                    </div>
                    
                    <motion.div
                      key={order.status}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                    >
                      {statusIcons[order.status]} {order.status.replace(/-/g, ' ')}
                    </motion.div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Placed: {new Date(order.createdAt).toLocaleString()}</span>
                      <span className="font-medium text-gray-900">
                        Total: LKR {order.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-medium text-gray-700 mb-2">Items:</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <motion.div
                            key={item._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start p-3 bg-gray-50 rounded-lg"
                          >
                            {item.itemId?.imageUrl ? (
                              <img 
                                src={item.itemId.imageUrl} 
                                alt={item.itemId.name}
                                className="w-16 h-16 object-cover rounded-md mr-3"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">
                                {item.itemId?.name || 'Unknown Item'}
                              </h4>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {item.itemId?.description || 'No description available'}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm font-medium">
                                  LKR {item.itemId?.price?.toFixed(2) || 'N/A'}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="mt-4 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cancel Order
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;