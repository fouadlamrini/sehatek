import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { FullPageLoader } from "../components/ui/Spinner";

const ProtectedRoute = () => {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <FullPageLoader label="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
