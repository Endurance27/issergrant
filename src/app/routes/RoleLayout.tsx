import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { SearchOverlay } from "../components/ui/SearchOverlay";
import { useAuthContext, roleToBasePath } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import type { Role } from "../data/mockData";

interface RoleLayoutProps {
  role: Role;
}

// Map sidebar page IDs to route segments
function pageToPath(role: Role, page: string): string {
  return roleToBasePath(role) + '/' + page;
}

export function RoleLayout({ role }: RoleLayoutProps) {
  const navigate = useNavigate();
  const { handleLogout, handleRoleChange, darkMode, toggleDark } = useAuthContext();
  const { unreadCount } = useAppContext();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Derive active page from current URL
  const activePage = window.location.pathname.split('/').pop() ?? 'dashboard';

  useEffect(() => {
    const check = () => setSidebarCollapsed(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleNavigate = (page: string) => {
    navigate(pageToPath(role, page));
  };

  const handleRoleChangeWithNav = (newRole: Role) => {
    handleRoleChange(newRole);
    navigate(roleToBasePath(newRole) + '/dashboard');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        currentRole={role}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          currentRole={role}
          onRoleChange={handleRoleChangeWithNav}
          darkMode={darkMode}
          onToggleDark={toggleDark}
          onNavigate={handleNavigate}
          unreadCount={unreadCount}
          onSearch={setSearchQuery}
        />
        {searchQuery && (
          <SearchOverlay
            query={searchQuery}
            onClose={() => setSearchQuery('')}
            onNavigate={page => { handleNavigate(page); setSearchQuery(''); }}
          />
        )}
        <main
          key={activePage}
          className="flex-1 overflow-y-auto animate-in fade-in duration-150"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}
        >
          <div className="p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
