import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Bell,
  ClipboardList,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Header = ({ user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [cartItems, setCartItems] = useState(2);
  const [activeOrders, setActiveOrders] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProfileOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".profile-menu") &&
        !event.target.closest(".mobile-menu")
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();

  return (
    <header
      // style={{ backgroundColor: "#4CAF50" }}
      className="text-white py-4 px-4 md:px-6 sticky top-0 z-50 shadow-md bg-gray-800"
    >
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        {/* Left Side - Logo & Hamburger (mobile) */}
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="mr-3 p-1 rounded-full hover:bg-white hover:bg-opacity-10 transition"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          <h1 className="text-xl font-bold">CloudKitchen</h1>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-2">
          <IconButton icon={<ClipboardList size={20} />} count={activeOrders} />
          <IconButton icon={<ShoppingCart size={20} />} count={cartItems} />
          <IconButton icon={<Bell size={20} />} count={notifications} />
          <ProfileMenu
            user={user}
            isOpen={isProfileOpen}
            toggle={toggleProfile}
          />
        </div>

        {/* Mobile Menu Button (visible on mobile) */}
        {!isMobileMenuOpen && (
          <div className="md:hidden flex items-center">
            <ProfileMenu
              user={user}
              isOpen={isProfileOpen}
              toggle={toggleProfile}
              mobile
            />
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu bg-white text-gray-800 absolute left-0 right-0 top-full shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="grid grid-cols-2 gap-4">
              <MobileMenuItem
                icon={<ClipboardList size={20} className="text-gray-700" />}
                label={`Orders (${activeOrders})`}
              />
              <MobileMenuItem
                icon={<ShoppingCart size={20} className="text-gray-700" />}
                label={`Cart (${cartItems})`}
              />
              <MobileMenuItem
                icon={<Bell size={20} className="text-gray-700" />}
                label={`Notifications (${notifications})`}
              />
              <MobileMenuItem
                icon={<User size={20} className="text-gray-700" />}
                label="Profile"
                onClick={toggleProfile}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Reusable Icon Button Component
const IconButton = ({ icon, count }) => (
  <button className="relative p-2 rounded-full hover:bg-[#fe5725] hover:bg-opacity-100 transition cursor-pointer">
    {icon}
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-white text-[#fe5725] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {count}
      </span>
    )}
  </button>
);

// Profile Menu Component
const ProfileMenu = ({ user, isOpen, toggle, mobile = false }) => (
  <div className={`relative ${mobile ? "ml-2" : ""} profile-menu`}>
    <button
      onClick={toggle}
      className={`flex items-center justify-center ${
        mobile ? "p-1" : "p-2"
      } rounded-full hover:bg-white hover:bg-opacity-10 transition cursor-pointer`}
    >
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile"
          className="h-8 w-8 rounded-full object-cover "
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-white text-gray-800 flex items-center justify-center font-semibold">
          {user?.email?.substring(0, 2).toUpperCase() || "US"}
        </div>
      )}
    </button>

    {isOpen && (
      <div
        className={`absolute ${
          mobile ? "right-0" : "right-0"
        } mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50`}
      >
        <a
          href="#"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <User size={16} className="mr-2" />
          Profile
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <Settings size={16} className="mr-2" />
          Settings
        </a>
        <a
          href="#"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </a>
      </div>
    )}
  </div>
);

// Mobile Menu Item Component
const MobileMenuItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition"
  >
    <div className="mb-1">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default Header;
