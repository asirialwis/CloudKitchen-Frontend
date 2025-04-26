import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts
const Main = lazy(() => import("./section/main"));
const AdminMain = lazy(() => import("./section/admin-main"));

// Main Pages
const Home = lazy(() => import("../pages/main/home"));
const Order = lazy(() => import("../pages/main/order"));

// Admin Pages
const AdminOverview = lazy(() => import("../pages/admin/admin-overview"));
const AdminUsers = lazy(() => import("../pages/admin/admin-users"));

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
        path: "order",
        Component: Order,
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
