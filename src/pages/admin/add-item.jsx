import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import axios from "axios";

const AddItem = () => {
  const { state } = useLocation();
  const restaurantDetails = state?.restaurant;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    isAvailable: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/restaurant-service/menus/${restaurantDetails._id}`,
        formData
      );

      // Redirect back to admin restaurant page
      navigate(`/admin/restaurant/${restaurantDetails._id}`, {
        state: { restaurant: restaurantDetails }
      });
    } catch (err) {
      console.error("Error adding menu item:", err);
      setError(err.response?.data?.message || err.message || "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white text-[#fe5725] p-2 rounded-full shadow hover:bg-gray-100 transition z-10"
        >
          <ChevronLeft size={24} />
        </button>

        <img
          src={restaurantDetails?.image}
          alt={restaurantDetails?.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/800x400?text=Restaurant+Image";
          }}
        />
        <div className="absolute inset-0 bg-[#fe5725] bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-3xl font-bold">Add New Menu Item</h1>
          <p className="mt-2">{restaurantDetails?.name}</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe5725] focus:border-[#fe5725] outline-none transition"
              placeholder="e.g., Chicken Biryani"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe5725] focus:border-[#fe5725] outline-none transition"
              placeholder="Describe the menu item..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (LKR) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe5725] focus:border-[#fe5725] outline-none transition"
                placeholder="e.g., 1050"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe5725] focus:border-[#fe5725] outline-none transition"
              >
                <option value="">Select a category</option>
                <option value="Main Course">Main Course</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
                <option value="Sides">Sides</option>
                <option value="Sides">Pizza</option>
                <option value="Sides">Burger</option>
                <option value="Sides">Snacks</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#fe5725] focus:border-[#fe5725] outline-none transition"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full bg-[#fe5725] text-white px-6 py-3 rounded-lg hover:bg-[#e04a20] transition disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Add Menu Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;