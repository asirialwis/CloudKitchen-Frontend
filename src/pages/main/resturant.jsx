import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import QuantityModal from "../../components/yohan/QuantityModal";
import axios from "axios";

const Restaurant = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const restaurantDetails = state?.restaurant;
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/restaurant-service/menus/${id}`
        );

        // Filter only available menu items
        const availableItems = response.data.filter((item) => item.isAvailable);
        setMenuItems(availableItems);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch menu items"
        );
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [id]);

  const handleAddToCart = (food) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingRestaurantId = localStorage.getItem("restaurantId");
    const existingRestaurantName = localStorage.getItem("restaurantName");

    if (existingCart.length === 0) {
      // Cart is empty - add the first item and save restaurant info
      const newItem = { ...food, quantity: 1 };
      localStorage.setItem("cart", JSON.stringify([newItem]));
      localStorage.setItem("restaurantId", food.restaurantId);
      localStorage.setItem("restaurantName", restaurantDetails.name);

      window.dispatchEvent(new Event("storage"));

      toast.success(`${food.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      if (food.restaurantId !== existingRestaurantId) {
        toast.error(
          `Please checkout your "${existingRestaurantName}" order before adding items from another restaurant.`,
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else {
        const existingItem = existingCart.find((item) => item._id === food._id);

        if (existingItem) {
          setSelectedFood(existingItem);
          setIsModalOpen(true);
        } else {
          const newItem = { ...food, quantity: 1 };
          const updatedCart = [...existingCart, newItem];
          localStorage.setItem("cart", JSON.stringify(updatedCart));

          window.dispatchEvent(new Event("storage"));

          toast.success(`${food.name} added to cart! 🛒`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    }
  };

  const handleQuantityUpdate = (newQuantity) => {
    if (newQuantity > 0) {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

      const updatedCart = existingCart.map((item) =>
        item._id === selectedFood._id
          ? { ...item, quantity: newQuantity }
          : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage"));
      toast.success(`Updated ${selectedFood.name} quantity to ${newQuantity}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Invalid quantity entered.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setIsModalOpen(false);
    setSelectedFood(null);
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const filteredMenuItems =
    selectedCategory === "All"
      ? Object.values(groupedMenu).flat()
      : groupedMenu[selectedCategory] || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fe5725]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center p-4 max-w-md">
          <p className="text-xl font-medium mb-2">Error loading menu</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#fe5725] text-white px-4 py-2 rounded hover:bg-[#e04a20] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-64 sm:h-48 overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white text-[#fe5725] p-2 rounded-full shadow hover:bg-gray-100 transition z-10 cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>

        <img
          src={restaurantDetails?.image}
          alt={restaurantDetails?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#fe5725] bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            {restaurantDetails?.name}
          </h1>
          <p className="mt-2">{restaurantDetails?.address}</p>
          <p className="mt-1 text-sm">{restaurantDetails?.contactNumber}</p>
        </div>
      </div>
      <div>
        {/* Menu Section */}
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Category Tags */}
          <div className="flex overflow-x-auto whitespace-nowrap gap-3 mb-6 scrollbar-hide px-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-[#fe5725] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            {Object.keys(groupedMenu).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#fe5725] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Food Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((food) => (
                <div
                  key={food._id}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <img
                    src={
                      food.imageUrl ||
                      "https://via.placeholder.com/400x300?text=Food+Item"
                    }
                    alt={food.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Food+Item";
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{food.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {food.description || "No description available."}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-[#fe5725]">
                        Rs. {food.price}
                      </span>
                      <button
                        className="bg-[#fe5725] text-white px-4 py-2 rounded-full text-sm hover:bg-[#e04a20] transition cursor-pointer"
                        onClick={() => handleAddToCart(food)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                No items found 🍽️
              </div>
            )}
          </div>
        </div>
      </div>

      <QuantityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFood(null);
        }}
        onConfirm={handleQuantityUpdate}
        selectedItem={selectedFood}
      />
    </div>
  );
};

export default Restaurant;
