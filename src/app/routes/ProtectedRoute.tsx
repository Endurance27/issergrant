/**
 * Route-level protected route — now powered by Zustand.
 * Kept in src/app/routes/ for the existing AppRoutes wiring.
 * The canonical version at src/app/components/auth/ProtectedRoute.tsx
 * uses the `roles` array API; this one preserves the `allowedRole` prop
 * so existing <Route element={<ProtectedRoute allowedRole="Admin" />}> calls
 * keep working without touching every route definition.
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { ROLE_DISPLAY, ROLE_BASE_PATH } from '../../types/user.types'
import type { DisplayRole } from '../../types/user.types'

interface ProtectedRouteProps {
  allowedRole: DisplayRole
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const userRole = useAuthStore((s) => s.user?.role ?? null)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Convert backend enum role to display label for comparison
  const displayRole: DisplayRole | null = userRole
    ? (ROLE_DISPLAY[userRole] ?? null)
    : null

  if (displayRole !== allowedRole) {
    const basePath = userRole ? (ROLE_BASE_PATH[userRole] ?? '/login') : '/login'
    return <Navigate to={`${basePath}/dashboard`} replace />
  }

  return <Outlet />
}
