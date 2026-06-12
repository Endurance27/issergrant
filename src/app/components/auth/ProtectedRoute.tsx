import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth.store'
import { ROLE_BASE_PATH } from '../../../types/user.types'

interface ProtectedRouteProps {
  /**
   * One or more backend role enums that are permitted to access this route.
   * e.g.  roles={["admin"]}
   *        roles={["researcher", "assistant_researcher"]}
   *
   * When omitted the route only requires authentication (any role allowed).
   */
  roles?: string[]
}

/**
 * Zustand-powered route guard.
 *
 * 1. Unauthenticated → /login
 * 2. Wrong role      → user's own dashboard
 * 3. Authorised      → <Outlet />
 */
export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const userRole = useAuthStore((s) => s.user?.role ?? null)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && userRole && !roles.includes(userRole)) {
    // Redirect to the user's correct dashboard rather than showing a 403
    const basePath = ROLE_BASE_PATH[userRole] ?? '/login'
    return <Navigate to={`${basePath}/dashboard`} replace />
  }

  return <Outlet />
}
