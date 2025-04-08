import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const AdminRoute = () => {
  const { isAuth, isAdmin } = useAuthStore();

  if (!isAuth) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />; 

  return <Outlet />;
};

export default AdminRoute;
