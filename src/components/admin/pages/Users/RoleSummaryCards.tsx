import type { User, Role } from "../../../../app/data/mockData";

const ROLE_COLORS: Record<Role, string> = {
  'Admin': '#1A3363',
  'Researcher': '#2D6EA8',
  'Assistant Researcher': '#B79A64',
  'Finance Officer': '#403C3A',
};

const ROLES: Role[] = ['Researcher', 'Assistant Researcher', 'Finance Officer', 'Admin'];

interface RoleSummaryCardsProps {
  users: User[];
  roleFilter: string;
  onRoleFilter: (role: string) => void;
}

export function RoleSummaryCards({ users, roleFilter, onRoleFilter }: RoleSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {ROLES.map(role => {
        const count = users.filter(u => u.role === role).length;
        const isActive = roleFilter === role;
        return (
          <button key={role} onClick={() => onRoleFilter(isActive ? 'All' : role)}
            className={`rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-left border ${isActive ? 'border-primary bg-secondary shadow-sm' : 'border-border bg-card'}`}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0" style={{ background: ROLE_COLORS[role] + '20' }}>
              <span className="font-bold text-sm" style={{ color: ROLE_COLORS[role] }}>{count}</span>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-xs text-foreground leading-snug">{role}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{count === 1 ? '1 user' : `${count} users`}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
