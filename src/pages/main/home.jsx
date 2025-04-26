import React, { useState } from "react";
import { Search, Clock, Star, MapPin, ChevronRight } from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Sample data
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
      cuisine: "American • Burgers",
      rating: 4.8,
      deliveryTime: "20-30 min",
      distance: "1.2 km",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      featured: true,
    },
    {
      id: 2,
      name: "Pizza Paradise",
      cuisine: "Italian • Pizza",
      rating: 4.6,
      deliveryTime: "25-35 min",
      distance: "2.5 km",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      name: "Sushi Master",
      cuisine: "Japanese • Sushi",
      rating: 4.9,
      deliveryTime: "30-40 min",
      distance: "3.1 km",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      name: "Sweet Heaven",
      cuisine: "Desserts • Cakes",
      rating: 4.7,
      deliveryTime: "15-25 min",
      distance: "0.8 km",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const featuredFoods = [
    {
      id: 1,
      name: "Double Cheeseburger",
      description: "Juicy beef patty with double cheese and special sauce",
      price: "$12.99",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      description: "Classic pizza with extra pepperoni and mozzarella",
      price: "$14.99",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Rainbow Sushi Platter",
      description: "Fresh sushi assortment with wasabi and soy sauce",
      price: "$22.99",
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    },
  ];

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
              placeholder="Search for restaurants or dishes..."
              className="w-full py-4 px-6 pr-12 rounded-full text-gray-800 shadow-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-2 bg-[#fe5725] p-2 rounded-full">
              <Search className="text-white" size={24} />
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
              }`}
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
          <button className="flex items-center text-[#fe5725]">
            See all <ChevronRight className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="relative h-48">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                {restaurant.featured && (
                  <div className="absolute top-2 left-2 bg-[#fe5725] text-white text-xs font-bold px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {restaurant.cuisine}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-yellow-500">
                    <Star className="fill-current" size={16} />
                    <span className="ml-1 text-gray-800">
                      {restaurant.rating}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={16} className="mr-1" />
                    {restaurant.deliveryTime}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={16} className="mr-1" />
                    {restaurant.distance}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Dishes */}
      <div className="max-w-6xl mx-auto px-4 py-8 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Dishes Near You</h2>
          <button className="flex items-center text-[#fe5725]">
            See all <ChevronRight className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredFoods.map((food) => (
            <div
              key={food.id}
              className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">{food.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{food.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-[#fe5725]">{food.price}</span>
                  <button className="bg-[#fe5725] text-white px-4 py-2 rounded-full text-sm hover:bg-[#e04a20] transition">
                    Add to Cart
                  </button>
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
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                className="h-10"
              />
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center">
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
