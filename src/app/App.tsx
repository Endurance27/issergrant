import { useState, useEffect } from "react";
import { AppProvider, useAppContext } from "./context/AppContext";
import { LoginPage } from "./components/auth/LoginPage";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./components/pages/Dashboard";
import { GrantCalls } from "./components/pages/GrantCalls";
import { Proposals } from "./components/pages/Proposals";
import { Awards } from "./components/pages/Awards";
import { Milestones } from "./components/pages/Milestones";
import { Financial } from "./components/pages/Financial";
import { Reports } from "./components/pages/Reports";
import { Notifications } from "./components/pages/Notifications";
import { Analytics } from "./components/pages/Analytics";
import { UserManagement } from "./components/pages/UserManagement";
import { AuditLogs } from "./components/pages/AuditLogs";
import { CalendarPage } from "./components/pages/CalendarPage";
import { Settings } from "./components/pages/Settings";
import { SearchOverlay } from "./components/ui/SearchOverlay";
import { ToastProvider } from "./components/ui/Toast";
import type { Role } from "./data/mockData";

export interface NavState {
  grantCallId?: string;
  grantCallTitle?: string;
}

function AppShell() {
  const { unreadCount } = useAppContext();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>('Admin');
  const [activePage, setActivePage] = useState('dashboard');
  const [navState, setNavState] = useState<NavState | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const check = () => setSidebarCollapsed(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleLogin = (role: Role) => {
    setCurrentRole(role);
    setLoggedIn(true);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setActivePage('dashboard');
  };

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    setActivePage('dashboard');
  };

  const handleNavigate = (page: string, state?: NavState) => {
    setActivePage(page);
    setNavState(state || null);
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':     return <Dashboard role={currentRole} onNavigate={handleNavigate} />;
      case 'grant-calls':   return <GrantCalls role={currentRole} onNavigate={handleNavigate} />;
      case 'proposals':     return <Proposals role={currentRole} navState={navState} />;
      case 'awards':        return <Awards role={currentRole} onNavigate={handleNavigate} />;
      case 'milestones':    return <Milestones role={currentRole} />;
      case 'financial':     return <Financial role={currentRole} />;
      case 'reports':       return <Reports role={currentRole} />;
      case 'notifications': return <Notifications />;
      case 'analytics':     return <Analytics />;
      case 'users':         return <UserManagement />;
      case 'audit':         return <AuditLogs />;
      case 'calendar':      return <CalendarPage />;
      case 'settings':      return <Settings role={currentRole} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />;
      default:              return <Dashboard role={currentRole} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        currentRole={currentRole}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
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
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ToastProvider>
  );
}
