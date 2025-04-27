import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart when payment succeeds
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("storage"));

    const timer = setTimeout(() => {
      navigate("/order");
    }, 4000); // Redirect after 4 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-800 p-4 sm:p-6">
      {/* Green Checkmark Icon */}
      <div className="bg-green-100 rounded-full p-4 sm:p-6 mb-6">
        <svg
          className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center">
        Payment Successful!
      </h1>

      {/* Subtext */}
      <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
        Thank you for your order. Redirecting you to your orders...
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/order")}
        className="w-full max-w-xs sm:max-w-sm px-6 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition"
      >
        View Orders Now
      </button>
    </div>
  );
};

export default Success;
