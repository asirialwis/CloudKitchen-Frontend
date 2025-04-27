import React, { useEffect } from "react";

const QuantityModal = ({ isOpen, onClose, onConfirm, selectedItem }) => {
  const [quantity, setQuantity] = React.useState(selectedItem?.quantity || 1);

  useEffect(() => {
    if (isOpen && selectedItem) {
      setQuantity(selectedItem.quantity || 1);
    }
  }, [isOpen, selectedItem]);

  if (!isOpen || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-2 text-center">
          Update Quantity for <br></br>
          {selectedItem.name}
        </h2>
        <input
          type="number"
          min="1"
          autoFocus
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border w-full p-2 mb-6 rounded text-center text-lg focus:outline-[#fe5725]"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(Number(quantity))}
            className="px-4 py-2 bg-[#fe5725] text-white rounded hover:bg-[#e04a20] font-medium"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityModal;
