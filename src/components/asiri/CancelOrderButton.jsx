import { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import { cancelOrder } from '../../api-calls/ordersAPI'; // Adjust the import path as necessary
import { toast } from 'react-toastify';

const CancelOrderButton = ({ orderId, onCancelSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    try {
      // Confirmation dialog
      const isConfirmed = window.confirm('Are you sure you want to cancel this order?');
      if (!isConfirmed) return;
      
      setIsLoading(true);
      
      // Call the cancel API
      const { message } = await cancelOrder(orderId);
      
      // Show success message
      toast.success(message);
      
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
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      onClick={handleCancel}
      disabled={isLoading}
    >
      <XCircle size={18} className="mr-2" />
      {isLoading ? 'Cancelling...' : 'Cancel Order'}
    </motion.button>
  );
};

export default CancelOrderButton;