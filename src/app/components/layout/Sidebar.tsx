import {
  LayoutDashboard, FileText, Award, Milestone, DollarSign,
  BarChart3, Bell, Users, Settings, Shield, Calendar,
  ChevronLeft, ChevronRight, LogOut, Megaphone, ClipboardList
} from "lucide-react";
import type { Role } from "../../data/mockData";
import { IsserLogo } from "../ui/IsserLogo";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',       icon: <LayoutDashboard size={18} />, roles: ['Admin', 'Researcher', 'Assistant Researcher', 'Finance Officer'] },
  { id: 'grant-calls',   label: 'Grant Calls',      icon: <Megaphone size={18} />,       roles: ['Admin', 'Researcher', 'Assistant Researcher'] },
  { id: 'proposals',     label: 'Proposals',        icon: <FileText size={18} />,        roles: ['Admin', 'Researcher', 'Assistant Researcher'] },
  { id: 'awards',        label: 'Awards & Funding', icon: <Award size={18} />,           roles: ['Admin', 'Researcher', 'Finance Officer'] },
  { id: 'milestones',    label: 'Milestones',       icon: <Milestone size={18} />,       roles: ['Admin', 'Researcher', 'Assistant Researcher'] },
  { id: 'financial',     label: 'Financial',        icon: <DollarSign size={18} />,      roles: ['Admin', 'Finance Officer'] },
  { id: 'reports',       label: 'Reports',          icon: <ClipboardList size={18} />,   roles: ['Admin', 'Researcher', 'Assistant Researcher', 'Finance Officer'] },
  { id: 'calendar',      label: 'Calendar',         icon: <Calendar size={18} />,        roles: ['Admin', 'Researcher', 'Assistant Researcher', 'Finance Officer'] },
  { id: 'analytics',     label: 'Analytics',        icon: <BarChart3 size={18} />,       roles: ['Admin', 'Finance Officer'] },
  { id: 'notifications', label: 'Notifications',    icon: <Bell size={18} />,            roles: ['Admin', 'Researcher', 'Assistant Researcher', 'Finance Officer'], badge: 3 },
  { id: 'users',         label: 'Team Members',     icon: <Users size={18} />,           roles: ['Admin', 'Researcher'] },
  { id: 'settings',      label: 'Settings',         icon: <Settings size={18} />,        roles: ['Admin', 'Researcher', 'Assistant Researcher', 'Finance Officer'] },
  { id: 'audit',         label: 'Audit Logs',       icon: <Shield size={18} />,          roles: ['Admin'] },
];

const navSections = [
  { label: null,       ids: ['dashboard'] },
  { label: 'Grants',   ids: ['grant-calls', 'proposals', 'awards', 'milestones'] },
  { label: 'Finance',  ids: ['financial', 'reports'] },
  { label: 'Insights', ids: ['calendar', 'analytics'] },
  { label: 'System',   ids: ['notifications', 'users', 'settings', 'audit'] },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  currentRole: Role;
  onLogout: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ activePage, onNavigate, currentRole, onLogout, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="h-screen flex flex-col transition-all duration-300 ease-in-out relative bg-sidebar border-r border-sidebar-border flex-shrink-0"
      style={{ width: collapsed ? 64 : 240 }}
    >
      <div className="flex items-center justify-center px-3 py-3 border-b border-sidebar-border min-h-[64px]">
        <IsserLogo height={collapsed ? 32 : 44} white />
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2" style={{ scrollbarWidth: 'none' as const }}>
        {navSections.map(section => {
          const sectionItems = section.ids
            .map(id => navItems.find(item => item.id === id)!)
            .filter(item => item && item.roles.includes(currentRole));

          if (!sectionItems.length) return null;

          return (
            <div key={section.label ?? 'main'} className="mb-1">
              {section.label && !collapsed && (
                <div className="px-2.5 pt-3 pb-1 text-[9px] font-bold uppercase tracking-widest select-none text-sidebar-foreground opacity-40">
                  {section.label}
                </div>
              )}
              {collapsed && section.label && (
                <div className="my-1.5 mx-2 h-px bg-white/[0.08]" />
              )}
              <div className="space-y-0.5">
                {sectionItems.map(item => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-3 rounded-md transition-all duration-150 relative group ${isActive ? 'bg-sidebar-accent' : 'hover:bg-white/5'}`}
                      style={{ padding: '8px 10px', justifyContent: collapsed ? 'center' : 'flex-start', color: isActive ? '#F8FAFC' : 'var(--sidebar-foreground)' }}
                      title={collapsed ? item.label : undefined}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full transition-all" style={{ background: '#B79A64' }} />
                      )}
                      <span className="shrink-0" style={{ color: isActive ? '#B79A64' : 'inherit' }}>{item.icon}</span>
                      {!collapsed && (
                        <span className="font-medium text-[13px] flex-1 text-left">{item.label}</span>
                      )}
                      {!collapsed && item.badge && (
                        <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-white font-mono text-[10px] px-1" style={{ background: '#B79A64' }}>
                          {item.badge}
                        </span>
                      )}
                      {collapsed && item.badge && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: '#B79A64' }} />
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity text-white bg-sidebar-accent">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-2 py-3 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-md transition-all duration-150 hover:bg-white/5 hover:text-red-400 text-slate-400"
          style={{ padding: '8px 10px', justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <LogOut size={18} />
          {!collapsed && <span className="font-medium text-[13px]">Sign Out</span>}
        </button>
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 z-10 flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-150 hover:scale-110 bg-sidebar-accent border border-white/15 text-slate-400"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
