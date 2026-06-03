import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext, roleToBasePath } from "../context/AuthContext";
import type { Role } from "../data/mockData";

interface ProtectedRouteProps {
  allowedRole: Role;
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { loggedIn, currentRole } = useAuthContext();

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole !== allowedRole) {
    return <Navigate to={roleToBasePath(currentRole) + '/dashboard'} replace />;
  }

  return <Outlet />;
}
