import { Search } from "lucide-react";
import type { Role } from "../../data/mockData";

const ROLES: Role[] = ['Researcher', 'Assistant Researcher', 'Finance Officer', 'Admin'];
const allRoles = ['All', ...ROLES];

interface UserFiltersProps {
  search: string;
  roleFilter: string;
  onSearch: (v: string) => void;
  onRoleFilter: (r: string) => void;
}

export function UserFilters({ search, roleFilter, onSearch, onRoleFilter }: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 flex-1 bg-card border border-border focus-within:border-primary/50 transition-colors">
        <Search size={15} className="text-muted-foreground flex-shrink-0" />
        <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search by name, email, or department..." className="bg-transparent outline-none flex-1 text-[13px] text-foreground min-w-0" />
      </div>
      <div className="flex gap-2 flex-wrap">
        {allRoles.map(r => (
          <button key={r} onClick={e => { e.stopPropagation(); onRoleFilter(r); }}
            className={`px-3 py-2 rounded-xl transition-all text-xs border whitespace-nowrap ${roleFilter === r ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
