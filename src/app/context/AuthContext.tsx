import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import type { Role } from "../data/mockData";

const roleByEmail: Record<string, Role> = {
  'sarah.ahmad@iser.edu': 'Admin',
  'james.okonkwo@iser.edu': 'Researcher',
  'chen.wei@iser.edu': 'Assistant Researcher',
  'fatima.rashid@iser.edu': 'Finance Officer',
};

export function roleToBasePath(role: Role): string {
  switch (role) {
    case 'Admin': return '/admin';
    case 'Researcher': return '/researcher';
    case 'Assistant Researcher': return '/assistant';
    case 'Finance Officer': return '/finance';
  }
}

interface AuthContextValue {
  loggedIn: boolean;
  currentRole: Role;
  darkMode: boolean;
  handleLogin: (role: Role) => void;
  handleLogout: () => Promise<void>;
  handleRoleChange: (role: Role) => void;
  toggleDark: () => void;
}

const AuthContext = createContext<AuthContextValue>(null!);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>('Admin');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const role: Role = roleByEmail[session.user.email.toLowerCase()] ?? 'Researcher';
        setCurrentRole(role);
        setLoggedIn(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        const role: Role = roleByEmail[session.user.email.toLowerCase()] ?? 'Researcher';
        setCurrentRole(role);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = useCallback((role: Role) => {
    setCurrentRole(role);
    setLoggedIn(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setLoggedIn(false);
  }, []);

  const handleRoleChange = useCallback((role: Role) => {
    setCurrentRole(role);
  }, []);

  const toggleDark = useCallback(() => setDarkMode(d => !d), []);

  return (
    <AuthContext.Provider value={{ loggedIn, currentRole, darkMode, handleLogin, handleLogout, handleRoleChange, toggleDark }}>
      {children}
    </AuthContext.Provider>
  );
}
