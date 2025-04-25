import Footer from "./footer";
import Header from "./header";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-6">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
