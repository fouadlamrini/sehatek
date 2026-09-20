import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { FullPageLoader } from "../components/ui/Spinner";

// UI-level guard only. The backend remains the source of truth for
// authorization: it returns 403 for restricted endpoints.
const RoleRoute = ({ role }) => {
  const { isAuthenticated, initializing, admin } = useAuth();

  if (initializing) {
    return <FullPageLoader label="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (admin?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
