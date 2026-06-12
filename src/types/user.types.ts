/** Full authenticated user record returned by the GraphQL backend */
export interface User {
  id: string
  authUserId: string
  name: string
  email: string
  /** Backend role enum: admin | researcher | assistant_researcher | finance_officer */
  role: string
  status: string
  department: string
  staffId: string
  phoneContact: string
  avatar?: string | null
  lastLogin?: string | null
  createdAt: string
  updatedAt: string
}

/** Frontend-friendly display labels for each role */
export type DisplayRole =
  | 'Admin'
  | 'Researcher'
  | 'Assistant Researcher'
  | 'Finance Officer'

/** Map backend enum → display label */
export const ROLE_DISPLAY: Record<string, DisplayRole> = {
  admin: 'Admin',
  researcher: 'Researcher',
  assistant_researcher: 'Assistant Researcher',
  finance_officer: 'Finance Officer',
}

/** Map display label → backend enum */
export const ROLE_ENUM: Record<DisplayRole, string> = {
  Admin: 'admin',
  Researcher: 'researcher',
  'Assistant Researcher': 'assistant_researcher',
  'Finance Officer': 'finance_officer',
}

/** Role-to-base-path mapping for routing */
export const ROLE_BASE_PATH: Record<string, string> = {
  admin: '/admin',
  researcher: '/researcher',
  assistant_researcher: '/assistant',
  finance_officer: '/finance',
}
