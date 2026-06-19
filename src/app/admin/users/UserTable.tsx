import {
  MoreHorizontal,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Pagination } from "../../components/ui/Pagination";
import { ScrollTable } from "../../components/ui/ScrollTable";
import type { User, Role } from "../../data/mockData";

const ROLE_COLORS: Record<Role, string> = {
  'Admin': '#1A3363',
  'Director': '#1A4A7A',
  'Researcher': '#2D6EA8',
  'Finance Officer': '#403C3A',
  'Guest': '#B79A64',
};

function TH({
  label,
  sortKey,
  active,
  dir,
  onToggle,
}: {
  label: string;
  sortKey?: string;
  active?: boolean;
  dir?: "asc" | "desc";
  onToggle?: () => void;
}) {
  return (
    <th
      onClick={onToggle}
      className={`text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-[0.05em] select-none ${onToggle ? "cursor-pointer hover:text-foreground" : ""}`}
    >
      <span className="flex items-center gap-1">
        {label}
        {onToggle &&
          (active ?
            dir === "asc" ?
              <ChevronUp size={11} />
            : <ChevronDown size={11} />
          : <ChevronUp size={11} className="opacity-20" />)}
      </span>
    </th>
  );
}

interface UserTableProps {
  paginated: User[];
  filtered: User[];
  sortKey: string;
  dir: "asc" | "desc";
  onToggle: (key: string) => void;
  activeMenu: number | null;
  onMenuToggle: (id: number) => void;
  onSuspend: (u: User) => void;
  onActivate: (id: number) => void;
  onDelete: (u: User) => void;
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  search: string;
}

export function UserTable({
  paginated,
  filtered,
  sortKey,
  dir,
  onToggle,
  activeMenu,
  onMenuToggle,
  onSuspend,
  onActivate,
  onDelete,
  page,
  totalPages,
  onPage,
  search,
}: UserTableProps) {
  return (
    <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
      <ScrollTable>
        <table className="w-full">
          <thead>
            <tr className="bg-muted border-b border-border">
              <TH
                label="User"
                sortKey="name"
                active={sortKey === "name"}
                dir={dir}
                onToggle={() => onToggle("name")}
              />
              <TH
                label="Role"
                sortKey="role"
                active={sortKey === "role"}
                dir={dir}
                onToggle={() => onToggle("role")}
              />
              <TH
                label="Department"
                sortKey="department"
                active={sortKey === "department"}
                dir={dir}
                onToggle={() => onToggle("department")}
              />
              <TH
                label="Joined"
                sortKey="joined"
                active={sortKey === "joined"}
                dir={dir}
                onToggle={() => onToggle("joined")}
              />
              <TH
                label="Status"
                sortKey="status"
                active={sortKey === "status"}
                dir={dir}
                onToggle={() => onToggle("status")}
              />
              <TH label="" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.map((u) => (
              <tr
                key={u.id}
                className="bg-card hover:bg-muted transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 text-white font-bold text-xs"
                      style={{ background: ROLE_COLORS[u.role] }}
                    >
                      {u.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[13px] text-foreground truncate">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge status={u.role} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {u.department}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {u.joined}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge status={u.status} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onMenuToggle(u.id)}
                      className="flex items-center justify-center rounded-lg p-1.5 transition-colors text-muted-foreground hover:bg-muted"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {activeMenu === u.id && (
                      <div className="absolute right-0 top-full mt-1 min-w-[190px] rounded-xl shadow-xl z-30 overflow-hidden bg-card border border-border">
                        {u.status === "Active" ?
                          <button
                            onClick={() => onSuspend(u)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-left text-[13px] hover:bg-muted text-amber-500"
                          >
                            <ShieldOff size={14} /> Suspend Account
                          </button>
                        : <button
                            onClick={() => onActivate(u.id)}
                            className="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-left text-[13px] hover:bg-muted text-green-500"
                          >
                            <ShieldCheck size={14} /> Activate Account
                          </button>
                        }
                        <div className="h-px bg-border mx-2" />
                        <button
                          onClick={() => onDelete(u)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-left text-[13px] hover:bg-muted text-red-500"
                        >
                          <Trash2 size={14} /> Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      {paginated.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Users size={22} className="text-muted-foreground opacity-40" />
          </div>
          <div className="font-bold text-sm text-foreground">
            No users found
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {search ? `No results for "${search}"` : "Try a different filter"}
          </div>
        </div>
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        total={filtered.length}
        pageSize={8}
        onPage={onPage}
      />
    </div>
  );
}
