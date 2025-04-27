import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Phone, MapPin, ChevronRight } from "lucide-react";
import axios from "axios";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false); // New state for tracking search
  const navigate = useNavigate();

  const categories = [
    "All",
    "Burgers",
    "Pizza",
    "Sushi",
    "Desserts",
    "Healthy",
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/restaurant-service/restaurants",
          {
            timeout: 5000,
          }
        );
        const availableRestaurants = response.data
          .filter(restaurant => restaurant.isAvailable)
          .map(restaurant => ({
            _id: restaurant._id,
            name: restaurant.name,
            description: restaurant.description,
            address: restaurant.address,
            contactNumber: restaurant.contactNumber,
            image: restaurant.imageUrl
          }));
        setRestaurants(availableRestaurants);
        setFilteredRestaurants(availableRestaurants);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch restaurants");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // When search field is empty, show all restaurants
      setFilteredRestaurants(restaurants);
      setIsSearchActive(false); // Reset search state
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().startsWith(query)
    );
    setFilteredRestaurants(results);
    setIsSearchActive(true); // Set search as active
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    if (searchQuery === "") {
      // If search field is already empty, refresh the list
      setFilteredRestaurants(restaurants);
      setIsSearchActive(false); // Reset search state
    }
  };

  const handleRestaurantClick = (restaurant) => {
    navigate(`/restaurant/${restaurant._id}`, { 
      state: { restaurant } 
    });
  };

  // Update filtered restaurants when search query becomes empty
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredRestaurants(restaurants);
      setIsSearchActive(false); // Reset search state when search is cleared
    }
  }, [searchQuery, restaurants]);

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
          <p className="text-xl font-medium mb-2">Error loading restaurants</p>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-600 mb-4">
            Make sure your backend server is running at http://localhost:3000
          </p>
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
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-[#fe5725] text-white py-16 px-4 md:px-0">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Craving something delicious?
          </h1>
          <p className="text-xl mb-8">
            Get your favorite food delivered in minutes
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for restaurants..."
              className="w-full py-4 px-6 pr-12 rounded-full bg-white text-gray-800 shadow-lg focus:outline-none placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleClearSearch();
              }}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="absolute right-2 top-2 bg-white p-2 rounded-full hover:bg-gray-100 transition"
              onClick={handleSearch}
            >
              <Search className="text-gray-500" size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                activeCategory === category
                  ? "bg-[#fe5725] text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              } transition-colors duration-200`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isSearchActive ? "Search Results" : "Available Restaurants"}
          </h2>
          <button className="flex items-center text-[#fe5725] hover:text-[#e04a20] transition-colors duration-200">
            See all <ChevronRight className="ml-1" />
          </button>
        </div>

        {filteredRestaurants.length === 0 && isSearchActive ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No restaurants found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image || "https://via.placeholder.com/400x300?text=Restaurant"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Restaurant";
                    }}
                  />
                </div>
                <div className="p-4 group-hover:bg-gray-50 transition-colors duration-300">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[#fe5725] transition-colors duration-200">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {restaurant.description || "No description available"}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mb-2 group-hover:text-gray-600 transition-colors duration-200">
                    <MapPin size={16} className="mr-2" />
                    <span>{restaurant.address || "Address not specified"}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-200">
                    <Phone size={16} className="mr-2" />
                    <span>{restaurant.contactNumber || "Not available"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-[#fe5725] rounded-xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Get 20% Off Your First Order!
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Download our app and use code WELCOME20 at checkout
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-colors duration-200">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                className="h-10"
              />
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center hover:bg-gray-900 transition-colors duration-200">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-10"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;