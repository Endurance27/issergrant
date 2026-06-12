/**
 * Route-level ProtectedRoute — powered entirely by Zustand.
 *
 * Behaviour:
 *   1. !isAuthenticated  → /login
 *   2. role mismatch     → /unauthorized
 *   3. authorised        → <Outlet />
 *
 * Usage (backend enum strings):
 *   <ProtectedRoute allowedRoles={["admin"]} />
 *   <ProtectedRoute allowedRoles={["researcher"]} />
 *   <ProtectedRoute allowedRoles={["assistant_researcher"]} />
 *   <ProtectedRoute allowedRoles={["finance_officer"]} />
 *
 * The legacy single-string prop `allowedRole` (DisplayRole) is also
 * supported for backwards compatibility with existing route definitions.
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { ROLE_ENUM } from '../../types/user.types'
import type { DisplayRole } from '../../types/user.types'

interface ProtectedRouteProps {
  /** Backend enum roles, e.g. ["admin"] */
  allowedRoles?: string[]
  /** Legacy display-label prop, e.g. "Admin" — converted to enum internally */
  allowedRole?: DisplayRole
}

export function ProtectedRoute({ allowedRoles, allowedRole }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const userRole = useAuthStore((s) => s.user?.role ?? null)

  // ── 1. Not logged in ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // ── Build the allowed set (supports both API styles) ───────────────────
  const allowed: string[] = [
    ...(allowedRoles ?? []),
    ...(allowedRole ? [ROLE_ENUM[allowedRole]] : []),
  ]

  // ── 2. Role not permitted ───────────────────────────────────────────────
  if (allowed.length > 0 && userRole && !allowed.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  // ── DEBUG (dev only — remove before going live) ─────────────────────────
  if (import.meta.env.DEV) {
    console.log('[ProtectedRoute] Authenticated:', isAuthenticated)
    console.log('[ProtectedRoute] User role:', userRole)
    console.log('[ProtectedRoute] Allowed:', allowed)
  }

  // ── 3. Authorised ──────────────────────────────────────────────────────
  return <Outlet />
}
