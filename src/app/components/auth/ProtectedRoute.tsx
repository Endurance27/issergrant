/**
 * Canonical ProtectedRoute — src/app/components/auth/ProtectedRoute.tsx
 *
 * Uses the `roles` array API (backend enum strings).
 * For the routes/ version (which also supports the legacy `allowedRole` prop)
 * see src/app/routes/ProtectedRoute.tsx.
 *
 * Usage:
 *   <ProtectedRoute roles={["admin"]}>
 *     <AdminLayout />
 *   </ProtectedRoute>
 */
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth.store'

interface ProtectedRouteProps {
  /** One or more backend enum role strings permitted to view this route */
  roles?: string[]
  children: React.ReactNode
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const userRole = useAuthStore((s) => s.user?.role ?? null)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && userRole && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
