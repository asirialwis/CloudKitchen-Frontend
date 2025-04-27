import React, { useState, useEffect } from 'react';
import { fetchCustomerOrders } from '../../api-calls/ordersAPI';
import { logout } from '../../auth/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';

const statusColors = {
  preparing: 'bg-blue-100 text-blue-800',
  'searching-drivers': 'bg-purple-100 text-purple-800',
  'on-the-way': 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-gray-100 text-gray-800'
};

// Animation components for each status using emojis instead of Lucide icons
const PreparingAnimation = () => (
  <div className="relative w-16 h-16">
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ 
        scale: [0.5, 1, 0.5],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{ 
        repeat: Infinity,
        duration: 2,
      }}
    >
      <div className="text-4xl">👨‍🍳</div>
    </motion.div>
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-blue-200"
      initial={{ scale: 0.8, opacity: 0.3 }}
      animate={{ 
        scale: [0.8, 1.2, 0.8],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{ 
        repeat: Infinity,
        duration: 2,
        delay: 0.5
      }}
    />
  </div>
);

const SearchingDriversAnimation = () => (
  <div className="relative w-16 h-16">
    <motion.div 
      className="absolute inset-0 flex items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{ 
        repeat: Infinity,
        duration: 6,
        ease: "linear" 
      }}
    >
      <div className="relative">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-purple-300 absolute"
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ 
            repeat: Infinity,
            duration: 2
          }}
        />
        <motion.div
          className="absolute"
          animate={{ 
            rotate: 360,
            x: [0, 8, 0, -8, 0],
            y: [0, -8, 0, 8, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 4
          }}
        >
          <div className="text-3xl">🚗</div>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

const OnTheWayAnimation = () => (
  <div className="relative w-16 h-16">
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ 
          x: [-20, 20, -20],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <div className="text-4xl">🏎️</div>
      </motion.div>
    </div>
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-2 bg-orange-200 rounded-full"
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ 
        repeat: Infinity,
        duration: 2,
        ease: "linear"
      }}
    />
  </div>
);

const DeliveredAnimation = () => (
  <div className="relative w-16 h-16 flex items-center justify-center">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CheckCircle size={36} className="text-green-500" />
    </motion.div>
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-green-200"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [0.8, 1.2, 1.5],
        opacity: [0.8, 0.4, 0],
      }}
      transition={{ 
        repeat: Infinity,
        duration: 2,
        repeatDelay: 1
      }}
    />
  </div>
);

const PendingAnimation = () => (
  <div className="relative w-16 h-16 flex items-center justify-center">
    <motion.div
      animate={{ 
        rotate: 360,
      }}
      transition={{ 
        repeat: Infinity,
        duration: 3,
        ease: "linear"
      }}
    >
      <Clock size={30} className="text-gray-500" />
    </motion.div>
  </div>
);

const CancelledAnimation = () => (
  <div className="relative w-16 h-16 flex items-center justify-center">
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ 
        rotate: [0, 10, -10, 10, -10, 0],
      }}
      transition={{ 
        duration: 0.5, 
        repeat: Infinity,
        repeatDelay: 2
      }}
    >
      <XCircle size={36} className="text-red-500" />
    </motion.div>
  </div>
);

const statusAnimations = {
  preparing: <PreparingAnimation />,
  'searching-drivers': <SearchingDriversAnimation />,
  'on-the-way': <OnTheWayAnimation />,
  delivered: <DeliveredAnimation />,
  cancelled: <CancelledAnimation />,
  pending: <PendingAnimation />
};

const statusIcons = {
  preparing: "👨‍🍳",
  'searching-drivers': "🚗",
  'on-the-way': "🏎️",
  delivered: <CheckCircle size={16} />,
  cancelled: <XCircle size={16} />,
  pending: <Clock size={16} />
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders initially and then every 10 seconds
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

    getOrders(); // Initial fetch
    
    // Set up polling every 10 seconds
    const intervalId = setInterval(getOrders, 10000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <motion.div 
        className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
      <p>{error}</p>
    </div>
  );

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.h1 
        className="text-3xl font-bold text-gray-800 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Orders
      </motion.h1>
      
      <AnimatePresence>
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-lg p-8 text-center"
          >
            <div className="flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-4 text-6xl"
              >
                🛵
              </motion.div>
              <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {statusAnimations[order.status]}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </h2>
                          {order.restaurantId && (
                            <p className="text-gray-600 mt-1 flex items-center">
                              <MapPin size={14} className="mr-1" />
                              {order.restaurantId.name}
                            </p>
                          )}
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                              <span className="mr-1">{statusIcons[order.status]}</span>
                              {formatStatus(order.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="font-medium text-gray-900 mt-1">
                            LKR {order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedOrder === order._id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 overflow-hidden"
                          >
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
                                  <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 flex items-center justify-center text-gray-400">
                                    {item.itemId?.imageUrl ? (
                                      <img 
                                        src={item.itemId.imageUrl} 
                                        alt={item.itemId.name}
                                        className="w-full h-full object-cover rounded-md"
                                      />
                                    ) : (
                                      <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-3xl"
                                      >
                                        🍔
                                      </motion.div>
                                    )}
                                  </div>
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
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="mt-4 flex justify-end">
                        {order.status === 'on-the-way' && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                          >
                            <MapPin size={16} className="mr-2" /> Track Order
                          </motion.button>
                        )}
                      </div>
                    </div>
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