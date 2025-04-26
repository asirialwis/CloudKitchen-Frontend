import React, { useState } from "react";
import { Search, Phone, MapPin, ChevronRight } from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Sample data matching backend schema
  const categories = [
    "All",
    "Burgers",
    "Pizza",
    "Sushi",
    "Desserts",
    "Healthy",
  ];

  const restaurants = [
    {
      id: 1,
      name: "Burger Kingdom",
      description: "Authentic American burgers with premium ingredients",
      address: "123 Main St, Cityville",
      contactNumber: "+1 555-1234",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      name: "Pizza Paradise",
      description: "Traditional Italian pizzas with wood-fired taste",
      address: "456 Oak Ave, Townsville",
      contactNumber: "+1 555-5678",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      name: "Sushi Master",
      description: "Authentic Japanese sushi prepared by master chefs",
      address: "789 Fish Rd, Seaville",
      contactNumber: "+1 555-9012",
      image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      name: "Sweet Heaven",
      description: "Artisanal desserts and pastries made daily",
      address: "321 Sugar Lane, Sweetville",
      contactNumber: "+1 555-3456",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 5,
      name: "Green Leaf",
      description: "Healthy organic meals for mindful eating",
      address: "654 Veggie Blvd, Healthtown",
      contactNumber: "+1 555-7890",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 6,
      name: "Taco Fiesta",
      description: "Mexican street food with authentic flavors",
      address: "987 Spice Street, Mexicoville",
      contactNumber: "+1 555-2345",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
  ];

  const handleRestaurantClick = (restaurantId) => {
    console.log(`Redirecting to menu for restaurant ${restaurantId}`);
  };

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
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-2 bg-white p-2 rounded-full">
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

      {/* Featured Restaurants */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Restaurants</h2>
          <button className="flex items-center text-[#fe5725] hover:text-[#e04a20] transition-colors duration-200">
            See all <ChevronRight className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
              onClick={() => handleRestaurantClick(restaurant.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 group-hover:bg-gray-50 transition-colors duration-300">
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#fe5725] transition-colors duration-200">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-2 group-hover:text-gray-600 transition-colors duration-200">
                  <MapPin size={16} className="mr-2" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-200">
                  <Phone size={16} className="mr-2" />
                  <span>{restaurant.contactNumber}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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