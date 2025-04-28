import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";


// Layouts
const Main = lazy(() => import("./section/main"));
const AdminMain = lazy(() => import("./section/admin-main"));

// Main Pages
const Home = lazy(() => import("../pages/main/home"));
const Order = lazy(() => import("../pages/main/order"));
const Restaurant = lazy(() => import("../pages/main/resturant"));
const CustomerOrderTracking = lazy(() => import("../pages/main/CustomerOrderTracking"));
const DriverNavigation = lazy(() => import("../pages/main/DriverNavigation"));

// Admin Pages
const AdminOverview = lazy(() => import("../pages/admin/admin-overview"));
const AdminUsers = lazy(() => import("../pages/admin/admin-users"));

const DeliveryRider = lazy(() => import("../pages/admin/delivery-rider"));

//Auth Pages
import Register from "../pages/auth/register";
import Login from "../pages/auth/login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        Component: ProtectedRoute,
        children:[
         {
          path: "order",
          Component: Order,
         }
        ]
       
      },
      {
        path: "restaurant/:id",
        Component: Restaurant,
      },
      {
        path: "orderTrack/:orderID",
        Component: CustomerOrderTracking,
      },
      {
        path: "delivery-rider",
        Component: DriverNavigation,
      }
    ],
  },
  {
    path: "/admin",
    Component: AdminMain,
    children: [
      {
        index: true,
        Component: AdminOverview,
      },
      {
        path: "users",
        Component: AdminUsers,
      },
    ],
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
]);

export default router;
