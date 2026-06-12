/**
 * AuthContext — thin bridge between Supabase auth events and the Zustand
 * auth store.
 *
 * It no longer owns user state. All user / session data lives in
 * `useAuthStore` (src/store/auth.store.ts).  This context only wires up
 * the Supabase listener and exposes helpers that still need to live here
 * for backwards compatibility (darkMode, roleToBasePath).
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/auth.store'
import { ROLE_DISPLAY, ROLE_BASE_PATH } from '../../types/user.types'
import type { User } from '../../types/user.types'
import type { DisplayRole } from '../../types/user.types'

// ── Legacy role type alias kept so existing code doesn't break ────────────
export type Role = DisplayRole

// ── Derive base path from backend enum role ───────────────────────────────
export function roleToBasePath(role: Role): string {
  const enumRole = Object.entries(ROLE_DISPLAY).find(([, v]) => v === role)?.[0]
  return enumRole ? (ROLE_BASE_PATH[enumRole] ?? '/login') : '/login'
}

// ─────────────────────────────────────────────────────────────────────────────
// Context — only carries UI-only state (darkMode) and Supabase-dependent
// helpers.  Authenticated user state is in Zustand.
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Whether the current user is logged in (mirrors Zustand isAuthenticated) */
  loggedIn: boolean
  /** Display role derived from the Zustand user record */
  currentRole: Role
  /** Supabase auth UID — kept for legacy callers; prefer useUser() from store */
  currentUserId: string
  darkMode: boolean
  /** Quick-login (demo / dev) — sets Zustand state without a real session */
  handleLogin: (role: Role) => void
  handleLogout: () => Promise<void>
  handleRoleChange: (role: Role) => void
  toggleDark: () => void
}

const AuthContext = createContext<AuthContextValue>(null!)

export function useAuthContext() {
  return useContext(AuthContext)
}

// Email → display role mapping for the demo accounts
const roleByEmail: Record<string, DisplayRole> = {
  'sarah.ahmad@iser.edu': 'Admin',
  'james.okonkwo@iser.edu': 'Researcher',
  'chen.wei@iser.edu': 'Assistant Researcher',
  'fatima.rashid@iser.edu': 'Finance Officer',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)

  // Pull live values from Zustand
  const zustandLogin = useAuthStore((s) => s.login)
  const zustandLogout = useAuthStore((s) => s.logout)
  const zustandSetUser = useAuthStore((s) => s.setUser)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const storeUser = useAuthStore((s) => s.user)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // ── Supabase session bridge ───────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email?.toLowerCase() ?? ''
        const displayRole = roleByEmail[email] ?? 'Researcher'
        const enumRole = Object.entries(ROLE_DISPLAY).find(([, v]) => v === displayRole)?.[0] ?? 'researcher'

        const user: User = {
          id: session.user.id,
          authUserId: session.user.id,
          name: session.user.user_metadata?.name ?? email.split('@')[0],
          email: session.user.email ?? '',
          role: enumRole,
          status: 'Active',
          department: '',
          staffId: '',
          phoneContact: '',
          avatar: session.user.user_metadata?.avatar_url ?? null,
          lastLogin: null,
          createdAt: session.user.created_at ?? '',
          updatedAt: '',
        }
        zustandLogin(user, session.access_token)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const email = session.user.email?.toLowerCase() ?? ''
          const displayRole = roleByEmail[email] ?? 'Researcher'
          const enumRole =
            Object.entries(ROLE_DISPLAY).find(([, v]) => v === displayRole)?.[0] ??
            'researcher'

          const user: User = {
            id: session.user.id,
            authUserId: session.user.id,
            name: session.user.user_metadata?.name ?? email.split('@')[0],
            email: session.user.email ?? '',
            role: enumRole,
            status: 'Active',
            department: '',
            staffId: '',
            phoneContact: '',
            avatar: session.user.user_metadata?.avatar_url ?? null,
            lastLogin: null,
            createdAt: session.user.created_at ?? '',
            updatedAt: '',
          }
          zustandLogin(user, session.access_token)
        } else {
          zustandLogout()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [zustandLogin, zustandLogout])

  // ── Derive display values from Zustand ────────────────────────────────────
  const currentRole: Role =
    storeUser?.role
      ? (ROLE_DISPLAY[storeUser.role] ?? 'Researcher')
      : 'Admin'

  const currentUserId = storeUser?.id ?? ''

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Demo / quick login — builds a synthetic User and stores it in Zustand */
  const handleLogin = useCallback(
    (role: Role) => {
      const enumRole =
        Object.entries(ROLE_DISPLAY).find(([, v]) => v === role)?.[0] ??
        'researcher'
      const syntheticUser: User = {
        id: `demo-${enumRole}`,
        authUserId: `demo-${enumRole}`,
        name: role,
        email: '',
        role: enumRole,
        status: 'Active',
        department: '',
        staffId: '',
        phoneContact: '',
        avatar: null,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      zustandLogin(syntheticUser, '')
    },
    [zustandLogin]
  )

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    zustandLogout()
  }, [zustandLogout])

  const handleRoleChange = useCallback(
    (role: Role) => {
      // Update just the role in the Zustand user object
      const current = useAuthStore.getState().user
      if (!current) return
      const enumRole =
        Object.entries(ROLE_DISPLAY).find(([, v]) => v === role)?.[0] ??
        current.role
      zustandSetUser({ ...current, role: enumRole })
    },
    [zustandSetUser]
  )

  const toggleDark = useCallback(() => setDarkMode((d) => !d), [])

  return (
    <AuthContext.Provider
      value={{
        loggedIn: isAuthenticated,
        currentRole,
        currentUserId,
        darkMode,
        handleLogin,
        handleLogout,
        handleRoleChange,
        toggleDark,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
