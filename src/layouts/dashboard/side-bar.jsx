import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Dashboard
      </div>
      <ul className="mt-4">
        <li className="p-4 hover:bg-gray-700 cursor-pointer">Home</li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">Orders</li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">Menu</li>
        <li className="p-4 hover:bg-gray-700 cursor-pointer">Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
