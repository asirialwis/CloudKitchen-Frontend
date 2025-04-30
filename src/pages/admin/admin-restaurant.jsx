import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import axios from "axios";

const Restaurant = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const restaurantDetails = state?.restaurant;
    const [menuItems, setMenuItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
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
                const availableItems = response.data.filter(item => item.isAvailable);
                setMenuItems(availableItems);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to fetch menu items");
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, [id]);

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(
                `http://localhost:3000/api/restaurant-service/menus/${itemId}`
            );
            // Remove the deleted item from state
            setMenuItems(menuItems.filter(item => item._id !== itemId));
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to delete menu item");
        }
    };

    const handleAddNewItem = () => {
        navigate("/admin/add-item", {
          state: { restaurant: restaurantDetails }
        });
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
                    className="absolute top-4 left-4 bg-white text-[#fe5725] p-2 rounded-full shadow hover:bg-gray-100 transition z-10"
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

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="flex justify-between items-center">
                    {/* Category Tags */}
                    <div className="flex overflow-x-auto whitespace-nowrap gap-3 scrollbar-hide px-2">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm cursor-pointer ${selectedCategory === "All"
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
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm cursor-pointer ${selectedCategory === category
                                        ? "bg-[#fe5725] text-white"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Add New Item Button */}
                    <button
                        onClick={handleAddNewItem}
                        className="flex items-center bg-[#fe5725] text-white px-4 py-2 rounded-lg hover:bg-[#e04a20] transition"
                    >
                        <Plus size={18} className="mr-2" />
                        Add New Item
                    </button>
                </div>

                {/* Food Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {filteredMenuItems.length > 0 ? (
                        filteredMenuItems.map((food) => (
                            <div
                                key={food._id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                            >
                                <img
                                    src={food.imageUrl || "https://via.placeholder.com/400x300?text=Food+Item"}
                                    alt={food.name}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/400x300?text=Food+Item";
                                    }}
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg">{food.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {food.description || "No description available"}
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="font-bold text-[#fe5725]">
                                            Rs. {food.price}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteItem(food._id)}
                                            className="text-red-500 hover:text-red-700 transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 text-center text-gray-500 py-12">
                            {menuItems.length === 0 ? "No menu items available" : "No items found in this category"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Restaurant;