import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/cart");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-800 p-4 sm:p-6">
      <div className="bg-red-100 rounded-full p-4 sm:p-6 mb-6">
        <svg
          className="h-12 w-12 sm:h-16 sm:w-16 text-red-600 animate-ping"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center">
        Payment Failed!
      </h1>

      <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
        Oops! Something went wrong. Redirecting you back to cart...
      </p>

      <button
        onClick={() => navigate("/cart")}
        className="w-full max-w-xs sm:max-w-sm px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition"
      >
        Return to Cart
      </button>
    </div>
  );
};

export default Cancel;
