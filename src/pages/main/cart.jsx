import React, { useEffect, useState } from "react";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [bouncingItemId, setBouncingItemId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  }, []);

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));

    // Trigger bounce effect
    setBouncingItemId(id);
    setTimeout(() => {
      setBouncingItemId(null);
    }, 300);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePayNow = () => {
    alert(`You have to pay Rs. ${totalAmount}`);
  };

  return (
    <div className="bg-gray-100">
      {/* Header Section */}
      <div className="relative h-52 sm:h-44 bg-gradient-to-r from-[#fe5725] to-[#ff7b3f] text-white flex flex-col justify-center items-center cursor-pointer">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white text-[#fe5725] p-2 rounded-full shadow hover:bg-gray-100 transition z-10"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Cart Icon and Text */}
        <div className="bg-white p-3 rounded-full shadow mb-2">
          <ShoppingCart size={32} className="text-[#fe5725]" />
        </div>

        <h1 className="text-2xl md:text-4xl font-bold">Your Cart</h1>
        <p className="mt-1 text-sm">Here’s what you’ve selected 🍽️</p>
      </div>

      {/* Cart Section */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 m-10 text-lg font-semibold">
            Your cart is empty 🛒
          </div>
        ) : (
          <>
            {cartItems.map((item, index) => (
              <div
                key={item._id}
                className={`flex flex-col sm:flex-row items-center justify-between bg-white shadow rounded-lg p-4 space-y-4 sm:space-y-0 
                  transform transition-all duration-500 ease-out opacity-0 animate-slide-up`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-20 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Rs. {item.price}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <div className="flex items-center bg-gray-100 p-1 rounded-full">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="px-3 py-1 text-lg font-bold text-[#fe5725] hover:bg-gray-200 rounded-full cursor-pointer"
                    >
                      -
                    </button>
                    <span
                      className={`px-4 font-semibold ${
                        bouncingItemId === item._id ? "bounce" : ""
                      }`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="px-3 py-1 text-lg font-bold text-[#fe5725] hover:bg-gray-200 rounded-full cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 bg-red-100 rounded-full p-3 hover:text-red-700 font-semibold text-sm cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total and Pay Now Section */}
            <div className="bg-white shadow rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold">Total: Rs. {totalAmount}</h2>
              <button
                onClick={handlePayNow}
                className="w-full sm:w-auto px-6 py-3 bg-[#fe5725] text-white font-semibold rounded-full hover:scale-105 hover:bg-[#e04a20] transition transform cursor-pointer"
              >
                Pay Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
