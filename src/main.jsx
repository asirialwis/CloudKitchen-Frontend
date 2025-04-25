import "./index.css";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import MainRoute from "./routes/main-route";
import Loader from "./components/common/loader";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <MainRoute />
      <ToastContainer />
    </Suspense>
  </StrictMode>
);
