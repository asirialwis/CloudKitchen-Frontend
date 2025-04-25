import { RouterProvider } from "react-router-dom";
import { router } from "./paths";

const MainRoute = () => {
  return <RouterProvider router={router} />;
};

export default MainRoute;
