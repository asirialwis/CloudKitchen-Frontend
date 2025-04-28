import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Utensils,
  Warehouse,
  Users,
  UserCog,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebarCollapsed");
      return stored ? JSON.parse(stored) : window.innerWidth >= 768;
    }
    return false;
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    const initialCollapse = stored
      ? JSON.parse(stored)
      : window.innerWidth >= 768;
    setIsCollapsed(initialCollapse);

    // Dispatch initial state
    window.dispatchEvent(
      new CustomEvent("sidebarToggle", {
        detail: { isCollapsed: initialCollapse },
      })
    );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);

    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent("sidebarToggle", {
        detail: { isCollapsed: newState },
      })
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? "auto" : "hidden";
  };

  const navItems = [
    {
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    { path: "/orders", icon: <ShoppingCart size={20} />, label: "Orders" },
    { path: "/admin/admin-home", icon: <Utensils size={20} />, label: "Menu Management" },
    { path: "/inventory", icon: <Warehouse size={20} />, label: "Inventory" },
    { path: "/staff", icon: <UserCog size={20} />, label: "Staff Management" },
    { path: "/customers", icon: <Users size={20} />, label: "Customers" },
    { path: "/reports", icon: <PieChart size={20} />, label: "Reports" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          style={{ backgroundColor: "#fe5725" }}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg text-white md:hidden"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ease-in-out fixed h-full z-40
          ${
            isMobile
              ? isMobileMenuOpen
                ? "left-0 w-3/4"
                : "-left-full"
              : isCollapsed
              ? "w-20"
              : "w-64"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Admin Profile Section */}
          <div
            className={`p-4 flex ${
              isCollapsed && !isMobile
                ? "flex-col items-center"
                : "items-center"
            } border-b border-gray-700`}
          >
            <div
              style={{ backgroundColor: "#fe5725" }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            >
              CK
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="ml-3">
                <p className="font-semibold">Admin User</p>
                <p className="text-xs text-gray-400">CloudKitchen Admin</p>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 p-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={
                      location.pathname === item.path
                        ? {
                            backgroundColor: "#fe5725",
                            color: "white",
                          }
                        : {}
                    }
                    className={`flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700
                      ${isCollapsed && !isMobile ? "justify-center" : ""}`}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  >
                    <span
                      style={{
                        color:
                          location.pathname === item.path ? "white" : "#fe5725",
                        opacity: location.pathname === item.path ? 1 : 0.8,
                      }}
                    >
                      {item.icon}
                    </span>
                    {(!isCollapsed || isMobile) && (
                      <span
                        className="ml-3"
                        style={{
                          color:
                            location.pathname === item.path
                              ? "white"
                              : "inherit",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Collapse Button - Hidden on mobile */}
          {!isMobile && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight style={{ color: "#fe5725" }} size={20} />
                ) : (
                  <>
                    <ChevronLeft style={{ color: "#fe5725" }} size={20} />
                    <span className="ml-2 text-gray-300">Collapse</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Very subtle overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-10 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;
