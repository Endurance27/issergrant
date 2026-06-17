/** Full authenticated user record returned by the GraphQL backend */
export interface User {
  userId: string;
  authUserId: string;
  name: string;
  email: string;
  /** Backend role enum: admin | researcher | assistant_researcher | finance_officer */
  role: string;
  status: string;
  department: string;
  staffId: string;
  phoneContact: string;
  avatar?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Frontend-friendly display labels for each role */
export type DisplayRole =
  | 'Admin'
  | 'Researcher (PI)'
  | 'Researcher (Co-PI)'
  | 'Finance Officer'
  | 'Director';

/** Map backend enum → display label */
export const ROLE_DISPLAY: Record<string, DisplayRole> = {
  admin: 'Admin',
  researcher_pi: 'Researcher (PI)',
  researcher_co_pi: 'Researcher (Co-PI)',
  finance_officer: 'Finance Officer',
  director: 'Director',
};

/** Map display label → backend enum */
export const ROLE_ENUM: Record<DisplayRole, string> = {
  Admin: 'admin',
  'Researcher (PI)': 'researcher_pi',
  'Researcher (Co-PI)': 'researcher_co_pi',
  'Finance Officer': 'finance_officer',
  Director: 'director',
};

/** Role-to-base-path mapping for routing */
export const ROLE_BASE_PATH: Record<string, string> = {
  admin: '/admin',
  researcher_pi: '/researcher-pi',
  researcher_co_pi: '/researcher-co-pi',
  finance_officer: '/finance',
  director: '/director',
};
