import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '../types/user.types'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthStore {
  /** Full authenticated user object — null when logged out */
  user: User | null
  /** JWT access token returned by the backend */
  accessToken: string | null
  /** Whether a valid session currently exists */
  isAuthenticated: boolean
  /** True while an auth operation (login / session restore) is in progress */
  loading: boolean

  // ── Granular setters (use selectors to read) ──────────────────────────────
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  setLoading: (loading: boolean) => void

  // ── Auth actions ─────────────────────────────────────────────────────────
  /** Called after a successful login mutation — stores user + token together */
  login: (user: User, token: string) => void
  /** Clear all auth state and persisted storage */
  logout: () => void
  /** Alias for logout — useful when clearing stale sessions */
  clearAuth: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user) => set({ user }),

      setAccessToken: (token) => set({ accessToken: token }),

      setLoading: (loading) => set({ loading }),

      login: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          loading: false,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          loading: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          loading: false,
        }),
    }),
    {
      name: 'auth-storage',          // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist what we need — never persist transient `loading`
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// ─────────────────────────────────────────────────────────────────────────────
// Pre-built selectors  (import these instead of calling useAuthStore())
// Usage:  const user = useUser()
//         const role = useUserRole()
// ─────────────────────────────────────────────────────────────────────────────

export const useUser = () => useAuthStore((s) => s.user)
export const useAccessToken = () => useAuthStore((s) => s.accessToken)
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useAuthLoading = () => useAuthStore((s) => s.loading)

/** Backend role enum string, e.g. "researcher" */
export const useUserRole = () => useAuthStore((s) => s.user?.role ?? null)

/** Convenience — resolves the base route path for the current user's role */
export const useUserBasePath = () =>
  useAuthStore((s) => {
    const role = s.user?.role
    const map: Record<string, string> = {
      admin: '/admin',
      researcher: '/researcher',
      assistant_researcher: '/assistant',
      finance_officer: '/finance',
    }
    return role ? (map[role] ?? '/login') : '/login'
  })
