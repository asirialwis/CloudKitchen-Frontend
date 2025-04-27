import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { cancelOrder } from '../../api-calls/ordersAPI'; // Adjust the import path as necessary
import { toast } from 'react-toastify';

const CancelOrderButton = ({ orderId, onCancelSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleOpenModal = () => {
    setShowConfirmModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      
      // Call the cancel API
      const { message } = await cancelOrder(orderId);
      
      // Close the modal
      handleCloseModal();
      
      // Show success message
      toast.success(message || 'Order cancelled successfully');
      
      // Trigger success callback if provided
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error) {
      // Show error message
      const errorMessage = error.response?.data?.message || 'Failed to cancel order';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center"
        onClick={handleOpenModal}
      >
        <XCircle size={18} className="mr-2" />
        Cancel Order
      </motion.button>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
              onClick={handleCloseModal}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-50 p-2 rounded-full mr-3">
                    <AlertTriangle size={24} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Cancel Order</h3>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-5">
                  <p className="text-sm text-red-600">
                    Note: Cancellation fees may apply depending on the order status.
                  </p>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Keep Order
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle size={18} className="mr-2" />
                      Yes, Cancel Order
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CancelOrderButton;