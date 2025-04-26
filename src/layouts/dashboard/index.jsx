import React, { useEffect } from "react";
import Sidebar from "./side-bar";

const DashboardLayout = ({ children }) => {
  useEffect(() => {
    const handleSidebarToggle = (e) => {
      const mainContent = document.querySelector("main");
      if (mainContent) {
        if (e.detail.isCollapsed) {
          mainContent.classList.add("md:ml-20");
          mainContent.classList.remove("md:ml-64");
        } else {
          mainContent.classList.add("md:ml-64");
          mainContent.classList.remove("md:ml-20");
        }
      }
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow p-6 bg-gray-100 md:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
