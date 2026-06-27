export interface User {
  UserId: string;
  authUserId: string;
  name: string;
  email: string;
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

export type DisplayRole =
  | 'Admin'
  | 'Director'
  | 'Finance Officer'
  | 'Researcher'
  | 'Guest';

export const ROLE_DISPLAY: Record<string, DisplayRole> = {
  admin: 'Admin',
  director: 'Director',
  finance_officer: 'Finance Officer',
  researcher: 'Researcher',
  guest: 'Guest',
};

export const ROLE_ENUM: Record<DisplayRole, string> = {
  Admin: 'admin',
  Director: 'director',
  'Finance Officer': 'finance_officer',
  Researcher: 'researcher',
  Guest: 'guest',
};

export const ROLE_BASE_PATH: Record<string, string> = {
  admin: '/admin',
  director: '/director',
  finance_officer: '/finance',
  researcher: '/researcher',
  guest: '/guest',
};
