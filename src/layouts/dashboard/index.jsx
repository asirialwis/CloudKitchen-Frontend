import React, { useEffect, useState } from "react";
import Sidebar from "./side-bar";

const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Initialize from localStorage
    const storedCollapse = localStorage.getItem("sidebarCollapsed");
    const initialCollapse = storedCollapse ? JSON.parse(storedCollapse) : false;
    setSidebarCollapsed(initialCollapse);

    const handleSidebarToggle = (e) => {
      setSidebarCollapsed(e.detail.isCollapsed);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={`flex-grow p-6 bg-gray-100 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
