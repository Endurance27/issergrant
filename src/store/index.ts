/**
 * Zustand store barrel — import stores from here.
 *
 * Usage:
 *   import { useAuthStore, useUser, useUserRole } from '@/store'
 */

// Auth store + pre-built selectors
export {
  useAuthStore,
  useUser,
  useAccessToken,
  useIsAuthenticated,
  useAuthLoading,
  useUserRole,
  useUserBasePath,
} from './auth.store'
export type { AuthStore } from './auth.store'
