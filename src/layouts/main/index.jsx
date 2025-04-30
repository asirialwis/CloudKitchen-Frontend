import Footer from "./footer";
import Header from "./header";
import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <Header />
        <main className="flex-grow p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
