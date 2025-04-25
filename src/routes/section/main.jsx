import MainLayout from "../../layouts/main";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Main;
