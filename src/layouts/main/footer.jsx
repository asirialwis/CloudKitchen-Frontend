import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer
      // style={{ backgroundColor: "#4CAF50" }}
      className="text-white pt-10 pb-5 px-8 md:px-6 bg-gray-800"
    >
      <div className="max-w-8xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center">
              <ShoppingBag className="mr-2" size={20} />
              CloudKitchen
            </h3>
            <p className="text-white text-opacity-90 text-sm leading-tight">
              Delivering delicious meals
              <br />
              to your doorstep
              <br />
              with love and care since 2023.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook">
                <Facebook
                  className="hover:text-white text-white text-opacity-80 transition"
                  size={18}
                />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram
                  className="hover:text-white text-white text-opacity-80 transition"
                  size={18}
                />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter
                  className="hover:text-white text-white text-opacity-80 transition"
                  size={18}
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-white text-white text-opacity-90 transition flex items-center text-sm"
                >
                  <Heart className="mr-2" size={16} /> Favorites
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white text-white text-opacity-90 transition flex items-center text-sm"
                >
                  <ShieldCheck className="mr-2" size={16} /> Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white text-white text-opacity-90 transition flex items-center text-sm"
                >
                  <ShieldCheck className="mr-2" size={16} /> Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-white text-opacity-90 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-start">
                <Mail className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-white text-opacity-90 text-sm">
                  support@cloudkitchen.com
                </span>
              </li>
              <li className="flex items-start">
                <MapPin className="mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-white text-opacity-90 text-sm">
                  123 Food Street, Kitchen City
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{ borderColor: "rgba(255,255,255,0.2)" }}
          className="border-t my-4"
        ></div>

        {/* Copyright Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-opacity-80 text-xs mb-3 md:mb-0">
            &copy; {new Date().getFullYear()} CloudKitchen. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-white text-opacity-80 hover:text-white text-xs transition"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white text-opacity-80 hover:text-white text-xs transition"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
