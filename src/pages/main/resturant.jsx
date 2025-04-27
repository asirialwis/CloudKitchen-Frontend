import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";
import QuantityModal from "../../components/yohan/QuantityModal";

const Restaurant = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const restaurantDetails = state?.restaurant;
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      const allMenuItems = [
        {
          _id: "1",
          restaurantId: "1",
          name: "Chicken Biryani",
          description: "Spicy basmati rice with marinated chicken and herbs",
          price: 950,
          imageUrl:
            "https://i.pinimg.com/1200x/b2/f3/69/b2f369286e98dcecedab6988d2a5bda3.jpg",
          category: "Main Course",
          isAvailable: true,
        },
        {
          _id: "2",
          restaurantId: "1",
          name: "Mutton Curry",
          description: "Tender mutton pieces cooked in spicy gravy",
          price: 1200,
          imageUrl:
            "https://i.pinimg.com/736x/e9/a5/92/e9a592bc11a55224937245014387e1d0.jpg",
          category: "Main Course",
          isAvailable: true,
        },
        {
          _id: "3",
          restaurantId: "1",
          name: "Paneer Butter Masala",
          description: "Cottage cheese cubes cooked in buttery tomato gravy",
          price: 850,
          imageUrl:
            "https://i.pinimg.com/736x/93/4c/1f/934c1ff62dcfaaee84b9def1249b0884.jpg",
          category: "Main Course",
          isAvailable: true,
        },
        {
          _id: "4",
          restaurantId: "1",
          name: "Veg Fried Rice",
          description: "Rice stir-fried with colorful veggies",
          price: 700,
          imageUrl:
            "https://i.pinimg.com/736x/c0/94/e0/c094e017caa0e1788c186906e420d17f.jpg",
          category: "Main Course",
          isAvailable: true,
        },
        {
          _id: "5",
          restaurantId: "1",
          name: "Chicken Shawarma",
          description: "Juicy chicken wrapped with veggies and sauces",
          price: 600,
          imageUrl:
            "https://i.pinimg.com/736x/8b/19/4b/8b194bd990b3d283e335d14c9af692ac.jpg",
          category: "Wraps",
          isAvailable: true,
        },
        {
          _id: "6",
          restaurantId: "1",
          name: "Cheese Pizza",
          description: "Classic pizza topped with extra mozzarella cheese",
          price: 1300,
          imageUrl:
            "https://i.pinimg.com/736x/a6/7c/18/a67c18e410a2aa22d3df52d26b3b3346.jpg",
          category: "Pizza",
          isAvailable: true,
        },
        {
          _id: "7",
          restaurantId: "1",
          name: "Veg Burger",
          description: "Crispy patty with fresh veggies and cheese",
          price: 500,
          imageUrl:
            "https://images.unsplash.com/photo-1550317138-10000687a72b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: "Burger",
          isAvailable: true,
        },
        {
          _id: "8",
          restaurantId: "1",
          name: "Chicken Wings",
          description: "Spicy deep-fried chicken wings",
          price: 950,
          imageUrl:
            "https://i.pinimg.com/736x/72/0a/9b/720a9b5e8d1ecaa4a51b1e942b1227ba.jpg",
          category: "Snacks",
          isAvailable: true,
        },
        {
          _id: "9",
          restaurantId: "1",
          name: "French Fries",
          description: "Crispy golden potato fries",
          price: 400,
          imageUrl:
            "https://i.pinimg.com/736x/33/40/86/33408671a27acb4a1d49cd5a5a90d77b.jpg",
          category: "Snacks",
          isAvailable: true,
        },
        {
          _id: "10",
          restaurantId: "1",
          name: "Chocolate Brownie",
          description: "Rich chocolate brownie served warm",
          price: 550,
          imageUrl:
            "https://i.pinimg.com/736x/f6/dc/b9/f6dcb957ca0195058bfc1fb6402e743b.jpg",
          category: "Desserts",
          isAvailable: true,
        },
        {
          _id: "11",
          restaurantId: "2",
          name: "Mango Smoothie",
          description: "Refreshing mango yogurt smoothie",
          price: 450,
          imageUrl:
            "https://i.pinimg.com/474x/f7/f0/8d/f7f08d3c52eb1da211be9fa6671a0d68.jpg",
          category: "Beverages",
          isAvailable: true,
        },
        {
          _id: "12",
          restaurantId: "2",
          name: "Lemon Iced Tea",
          description: "Chilled lemon-flavored iced tea",
          price: 300,
          imageUrl:
            "https://i.pinimg.com/736x/71/d0/e7/71d0e72e00cbe1b48045e09ec0f58f8d.jpg",
          category: "Beverages",
          isAvailable: true,
        },
      ];

      const filteredItems = allMenuItems.filter(
        (item) => item.restaurantId === id && item.isAvailable
      );

      setMenuItems(filteredItems);
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
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{food.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {food.description}
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
