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
const addItem = lazy(() => import("../pages/admin/add-item"));

// Admin Pages
const AdminOverview = lazy(() => import("../pages/admin/admin-overview"));
const AdminUsers = lazy(() => import("../pages/admin/admin-users"));
const AdminHome = lazy(() => import("../pages/admin/admin-home"));
const AdminRestaurant = lazy(() => import("../pages/admin/admin-restaurant"));

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
      {
        path: "delivery-rider",
        Component: DeliveryRider,
      },
      {
        path: "admin-home",
        Component: AdminHome,
      },
      {
        path: "restaurant/:id",
        Component: AdminRestaurant,
      },
      {
        path: "add-item",
        Component: addItem,
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
