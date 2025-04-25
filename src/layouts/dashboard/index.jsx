import React from "react";
import Sidebar from "./side-bar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default DashboardLayout;
