import { ShieldCheck, ShieldOff, Trash2, Users } from "lucide-react";
import { Badge } from "../../../../app/components/ui/Badge";
import { Pagination } from "../../../../app/components/ui/Pagination";
import type { User, Role } from "../../../../app/data/mockData";

const ROLE_COLORS: Record<Role, string> = {
  'Admin': '#1A3363',
  'Researcher': '#2D6EA8',
  'Assistant Researcher': '#B79A64',
  'Finance Officer': '#403C3A',
};

interface UserCardListProps {
  paginated: User[];
  filtered: User[];
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  onSuspend: (u: User) => void;
  onActivate: (id: number) => void;
  onDelete: (u: User) => void;
}

export function UserCardList({ paginated, filtered, page, totalPages, onPage, onSuspend, onActivate, onDelete }: UserCardListProps) {
  return (
    <div className="md:hidden space-y-3">
      {paginated.map(u => (
        <div key={u.id} className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-full flex-shrink-0 text-white font-bold text-sm" style={{ background: ROLE_COLORS[u.role] }}>{u.avatar}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[14px] text-foreground">{u.name}</div>
              <div className="text-xs text-muted-foreground truncate">{u.email}</div>
            </div>
            <Badge status={u.status} size="sm" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 rounded-lg bg-muted">
              <div className="text-[10px] text-muted-foreground mb-0.5">Role</div>
              <div className="text-xs font-semibold text-foreground">{u.role}</div>
            </div>
            <div className="p-2 rounded-lg bg-muted">
              <div className="text-[10px] text-muted-foreground mb-0.5">Department</div>
              <div className="text-xs font-semibold text-foreground truncate">{u.department}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            {u.status === 'Active' ? (
              <button onClick={() => onSuspend(u)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-500 bg-amber-50 border border-amber-300">
                <ShieldOff size={12} /> Suspend
              </button>
            ) : (
              <button onClick={() => onActivate(u.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-500 bg-green-50 border border-green-300">
                <ShieldCheck size={12} /> Activate
              </button>
            )}
            <button onClick={() => onDelete(u)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 border border-red-300">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      ))}
      {paginated.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-border">
          <Users size={32} className="text-muted-foreground opacity-30 mb-3" />
          <div className="font-bold text-sm text-foreground">No users found</div>
        </div>
      )}
      <div className="pt-2">
        <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={8} onPage={onPage} />
      </div>
    </div>
  );
}
