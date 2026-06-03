import { Bell, Search, Moon, Sun, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Role } from "../../data/mockData";
import { currentUsers } from "../../data/mockData";

const roleColors: Record<Role, string> = {
  'Admin': 'var(--primary)',
  'Researcher': 'var(--primary)',
  'Assistant Researcher': '#B79A64',
  'Finance Officer': '#403C3A',
};

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  onNavigate: (page: string) => void;
  unreadCount: number;
  onSearch: (query: string) => void;
}

const roles: Role[] = ['Admin', 'Researcher', 'Assistant Researcher', 'Finance Officer'];

export function Header({ currentRole, onRoleChange, darkMode, onToggleDark, onNavigate, unreadCount, onSearch }: HeaderProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = currentUsers[currentRole];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && showRoleMenu) {
        setShowRoleMenu(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showRoleMenu]);

  return (
    <header className="flex items-center justify-between px-6 h-16 flex-shrink-0 bg-card border-b border-border z-10">
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 max-w-sm bg-muted border border-border">
        <Search size={15} className="text-muted-foreground" />
        <input
          ref={searchRef}
          placeholder="Search grants, proposals, users..."
          className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground text-[13px] text-foreground"
          onChange={e => onSearch(e.target.value)}
        />
        <kbd className="hidden sm:flex items-center gap-1 rounded px-1.5 py-0.5 bg-border text-muted-foreground font-mono text-[10px]">⌘K</kbd>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150 hover:bg-muted text-muted-foreground"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={() => onNavigate('notifications')}
          className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150 hover:bg-muted text-muted-foreground"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 rounded-full bg-red-500 text-white font-mono font-bold leading-none px-[3px] text-[9px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowRoleMenu(v => !v)}
            onKeyDown={e => e.key === 'Escape' && setShowRoleMenu(false)}
            aria-expanded={showRoleMenu}
            aria-haspopup="true"
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-all duration-150 hover:bg-muted ${showRoleMenu ? 'bg-muted' : ''}`}
          >
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-bold text-[11px] size-[30px]"
              style={{ background: roleColors[currentRole] }}
            >
              {user.avatar}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-semibold text-xs text-foreground leading-tight">{user.name}</div>
              <div className="text-[11px] text-muted-foreground leading-tight">{currentRole}</div>
            </div>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>

          {showRoleMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
              <div
                className="absolute right-0 top-full mt-1 min-w-[200px] rounded-lg shadow-lg z-50 overflow-hidden bg-card border border-border"
                role="menu"
              >
                <div className="px-3 py-2 border-b border-border">
                  <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.06em]">Switch Role (Demo)</div>
                </div>
                {roles.map(role => (
                  <button
                    key={role}
                    role="menuitem"
                    onClick={() => { onRoleChange(role); setShowRoleMenu(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 transition-all duration-150 text-left hover:bg-muted ${currentRole === role ? 'bg-muted' : ''}`}
                  >
                    <div
                      className="flex items-center justify-center rounded-full text-white font-bold text-[9px] size-[24px]"
                      style={{ background: roleColors[role] }}
                    >
                      {currentUsers[role].avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-foreground">{currentUsers[role].name}</div>
                      <div className="text-[11px] text-muted-foreground">{role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
