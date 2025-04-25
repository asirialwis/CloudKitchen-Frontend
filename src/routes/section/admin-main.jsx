import DashboardLayout from "../../layouts/dashboard";
import { Outlet } from "react-router-dom";

const AdminMain = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminMain;
