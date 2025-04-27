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
const Cart = lazy(() => import("../pages/main/cart"));
const Success = lazy(() => import("../pages/main/success"));
const Cancel = lazy(() => import("../pages/main/cancel"));
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
        children: [
          {
            path: "order",
            Component: Order,
          },
        ],
      },
      {
        path: "restaurant/:id",
        Component: Restaurant,
      },
      {
        path: "cart",
        Component: Cart,
      },
      {
        path: "success",
        Component: Success,
      },
      {
        path: "cancel",
        Component: Cancel,
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
      }
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
