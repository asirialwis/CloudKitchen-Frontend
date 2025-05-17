import React, { useState, useEffect } from 'react';
import { fetchCustomerOrders } from '../../api-calls/ordersAPI';
import { logout } from '../../auth/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, Package, Bike,Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CancelOrderButton from './CancelOrderButton';

// Status colors with improved contrast
const statusColors = {
  preparing: 'bg-blue-100 text-blue-800 border border-blue-200',
  'searching-drivers': 'bg-purple-100 text-purple-800 border border-purple-200',
  'on-the-way': 'bg-orange-100 text-orange-800 border border-orange-200',
  delivered: 'bg-green-100 text-green-800 border border-green-200',
  cancelled: 'bg-red-100 text-red-800 border border-red-200',
  pending: 'bg-gray-100 text-gray-800 border border-gray-200'
};

// Status messages to provide context
const statusMessages = {
  preparing: "Your order is being prepared by the chef",
  'searching-drivers': "We're finding a delivery partner for your order",
  'on-the-way': "Your order is on its way to you",
  delivered: "Your order has been delivered successfully",
  cancelled: "This order has been cancelled",
  pending: "Your order is waiting to be confirmed"
};

// Animation components for each status
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
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Pulsing background circle */}
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-purple-300 absolute"
        animate={{ 
          scale: [0.8, 1.1, 0.8],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut"
        }}
      />
      
      {/* Magnifying glass with scanning motion */}
      <motion.div
        className="absolute"
        initial={{ x: -10, y: -10 }}
        animate={{
          x: [
            -10, -5, 0, 5, 10, 5, 0, -5, -10
          ],
          y: [
            -10, -5, 0, 5, 10, 5, 0, -5, -10
          ]
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "linear",
          times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
        }}
      >
        <motion.div
          animate={{
            rotate: [-10, 10, -10],
            scale: [1, 1.1, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <div className="text-3xl">🔍</div>
        </motion.div>
      </motion.div>
      
      {/* Small dots representing search results/drivers */}
      <motion.div 
        className="absolute w-2 h-2 bg-purple-500 rounded-full"
        initial={{ opacity: 0, x: -8, y: 8 }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{
          repeat: Infinity, 
          duration: 2,
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute w-2 h-2 bg-purple-500 rounded-full"
        initial={{ opacity: 0, x: 8, y: -8 }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{
          repeat: Infinity, 
          duration: 2,
          delay: 0.5
        }}
      />
    </div>
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
        <div className="text-4xl">🚴‍♂️</div>
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

  const navigate = useNavigate()

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

  // Format date and time from ISO string
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    
    // Format date: Apr 27, 2025
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Format time: 8:52 AM
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    
    return { formattedDate, formattedTime };
  };

  const formatStatus = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate total price from items
  const calculateItemTotal = (item) => {
    if (item.itemId && item.itemId.price) {
      return (item.itemId.price * item.quantity).toFixed(2);
    }
    return 'N/A';
  };

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


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
        <p className="text-gray-500 mt-2">Track and manage all your food deliveries</p>
      </motion.div>
      
      <AnimatePresence>
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 rounded-lg p-8 text-center"
          >
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-6xl"
              >
                🛍️
              </motion.div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Orders Yet</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">You haven't placed any orders yet. Explore restaurants and find your favorite meals!</p>
              <motion.button
               onClick={() => window.location.href = '/'}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Restaurants
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const { formattedDate, formattedTime } = formatDateTime(order.createdAt);
              
              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-6">
                        {statusAnimations[order.status]}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                              Order #{order._id.slice(-6).toUpperCase()}
                            </h2>
                            
                            {order.restaurantId && (
                              <div className="mt-2">
                                <p className="text-gray-700 font-medium flex items-center">
                                  {order.restaurantId.name}
                                </p>
                                <p className="text-gray-500 text-sm flex items-center mt-1">
                                  <MapPin size={14} className="mr-1 flex-shrink-0" />
                                  {order.restaurantId.address}
                                </p>
                              </div>
                            )}
                            
                            <div className="mt-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                                <span className="mr-1">{statusIcons[order.status]}</span>
                                {formatStatus(order.status)}
                              </span>
                              
                              <p className="text-sm text-gray-600 mt-2">
                                {statusMessages[order.status]}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-500 flex flex-col items-end">
                              <span>{formattedDate}</span>
                              <span className="text-gray-400">{formattedTime}</span>
                            </p>
                            <p className="font-medium text-lg text-gray-900 mt-2">
                              LKR {order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button 
                            onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                            className="flex items-center text-orange-500 hover:text-orange-600 transition-colors font-medium"
                          >
                            {selectedOrder === order._id ? (
                              <>
                                <span>Hide details</span>
                                <ChevronUp size={18} className="ml-1" />
                              </>
                            ) : (
                              <>
                                <span>View order details</span>
                                <ChevronDown size={18} className="ml-1" />
                              </>
                            )}
                          </button>
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
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                                  <Package size={16} className="mr-2" />
                                  Order Items
                                </h3>
                                
                                <div className="space-y-3">
                                  {order.items.map((item, index) => (
                                    <motion.div
                                      key={item._id}
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-start p-3 bg-white rounded-lg border border-gray-100"
                                    >
                                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-3 flex items-center justify-center overflow-hidden">
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
                                        <div className="flex justify-between">
                                          <h4 className="font-medium text-gray-800">
                                            {item.itemId?.name || 'Unknown Item'}
                                          </h4>
                                          <span className="font-medium text-gray-700">
                                            LKR {calculateItemTotal(item)}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                          {item.itemId?.description || 'No description available'}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                          <span className="text-sm text-gray-500">
                                            LKR {item.itemId?.price?.toFixed(2) || 'N/A'} each
                                          </span>
                                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                            Qty: {item.quantity}
                                          </span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                                
                                {/* Order Summary */}
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Subtotal</span>
                                    <span>LKR {(order.totalAmount * 0.9).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Delivery Fee</span>
                                    <span>LKR {(order.totalAmount * 0.1).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between font-medium text-gray-800 mt-2 pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>LKR {order.totalAmount.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="mt-4 flex justify-end space-x-3">
                          {order.status === 'on-the-way' && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center shadow-sm"
                              onClick={() => navigate("orderTrack/680fd6cfe8c65f82051b1514")}
                            >
                              <Truck size={18} className="mr-2" /> Track Order
                            </motion.button>
                          )}
                          
                          {(order.status === 'preparing' || order.status === 'searching-drivers' || order.status === 'pending') && (
                            <CancelOrderButton 
                            orderId={order._id}
                            // onCancelSuccess={handleCancelSuccess}
                          />
                          )}
                          
                          {order.status === 'delivered' && (
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className="px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                            >
                              Reorder
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;