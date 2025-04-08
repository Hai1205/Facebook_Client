import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

const AuthRoute = () => {
  const { isAuth } = useAuthStore();
  
  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRoute;
