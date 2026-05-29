import { useState } from "react";
import { Plus, Search, MoreHorizontal, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useToast } from "../ui/Toast";
import { ScrollTable } from "../ui/ScrollTable";
import { PageHeader } from "../ui/PageHeader";
import { users as initialUsers } from "../../data/mockData";
import type { User, Role } from "../../data/mockData";

const roleColors: Record<Role, string> = {
  'Admin': 'var(--primary)',
  'Researcher': 'var(--primary)',
  'Assistant Researcher': '#B79A64',
  'Finance Officer': '#403C3A',
};

const departmentOptions = ['Administration', 'Biomedical Engineering', 'Computer Science', 'Environmental Science', 'Physics', 'Finance & Accounts', 'Education'];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<User | null>(null);

  const roles = ['All', 'Admin', 'Researcher', 'Assistant Researcher', 'Finance Officer'];
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const { toast } = useToast();
  const toggleStatus = (id: number, wasSuspended: boolean) => { setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u)); toast(wasSuspended ? 'Account activated' : 'Account suspended', wasSuspended ? 'success' : 'warning'); };
  const deleteUser = (id: number) => { setUsers(prev => prev.filter(u => u.id !== id)); toast('User deleted', 'error'); };

  const activeCount = users.filter(u => u.status === 'Active').length;
  const deptCount = new Set(users.map(u => u.department)).size;

  return (
    <div onClick={() => setActiveMenu(null)}>
      <PageHeader
        title="User Management"
        subtitle={`${activeCount} active users across ${deptCount} departments`}
        action={
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add User
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {(['Admin', 'Researcher', 'Assistant Researcher', 'Finance Officer'] as Role[]).map(role => {
          const count = users.filter(u => u.role === role).length;
          return (
            <div key={role} className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md bg-card border border-border" onClick={() => setRoleFilter(role)}>
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 36, height: 36, background: roleColors[role] + '20' }}>
                <span className="font-extrabold text-sm" style={{ color: roleColors[role] }}>{count}</span>
              </div>
              <div className="font-semibold text-xs text-foreground leading-snug">{role}</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 bg-card border border-border">
          <Search size={15} className="text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name, email, or department..." className="bg-transparent outline-none flex-1 text-[13px] text-foreground" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roles.map(r => (
            <button key={r} onClick={e => { e.stopPropagation(); setRoleFilter(r); }} className={`px-3 py-2 rounded-lg transition-all text-xs border whitespace-nowrap ${roleFilter === r ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-border">
        <ScrollTable>
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                {['User', 'Role', 'Department', 'Joined', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-[0.05em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(u => (
                <tr key={u.id} className="bg-card hover:bg-muted transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-bold text-xs" style={{ width: 34, height: 34, background: roleColors[u.role] }}>{u.avatar}</div>
                      <div>
                        <div className="font-bold text-[13px] text-foreground">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge status={u.role} size="sm" /></td>
                  <td className="px-4 py-3"><span className="text-xs text-muted-foreground whitespace-nowrap">{u.department}</span></td>
                  <td className="px-4 py-3"><span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">{u.joined}</span></td>
                  <td className="px-4 py-3"><Badge status={u.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button onClick={e => { e.stopPropagation(); setActiveMenu(activeMenu === u.id ? null : u.id); }}
                        className="flex items-center justify-center rounded-lg p-1.5 transition-colors text-muted-foreground hover:bg-muted">
                        <MoreHorizontal size={16} />
                      </button>
                      {activeMenu === u.id && (
                        <div className="absolute right-0 top-full mt-1 rounded-lg shadow-lg z-20 overflow-hidden bg-card border border-border" style={{ minWidth: 180 }} onClick={e => e.stopPropagation()}>
                          {u.status === 'Active' ? (
                            <button onClick={() => { setConfirmSuspend(u); setActiveMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 transition-colors text-left text-[13px] hover:bg-muted"
                              style={{ color: '#F59E0B' }}>
                              <ShieldOff size={14} /> Suspend Account
                            </button>
                          ) : (
                            <button onClick={() => { toggleStatus(u.id, true); setActiveMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2 transition-colors text-left text-[13px] hover:bg-muted"
                              style={{ color: '#22C55E' }}>
                              <ShieldCheck size={14} /> Activate Account
                            </button>
                          )}
                          <button onClick={() => { setConfirmDelete(u); setActiveMenu(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2 transition-colors text-left text-[13px] hover:bg-muted"
                            style={{ color: '#EF4444' }}>
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
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Search size={22} className="text-muted-foreground opacity-50" />
            </div>
            <div className="font-bold text-sm text-foreground mb-1">No users found</div>
            <div className="text-[13px] text-muted-foreground">
              {search ? `No results for "${search}"` : 'Try a different role filter'}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted">
          <span className="text-xs text-muted-foreground">Showing {filtered.length} of {users.length} users</span>
        </div>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New User" width={540}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name</label>
              <input type="text" placeholder="Dr. Jane Smith" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address</label>
              <input type="email" placeholder="jane@iser.edu" className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Role</label>
            <select className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground">
              <option>Researcher</option>
              <option>Assistant Researcher</option>
              <option>Finance Officer</option>
              <option>Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Department</label>
            <select className="w-full px-3 py-2 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground">
              {departmentOptions.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="p-3 rounded-lg bg-secondary border border-primary/20">
            <p className="text-xs text-primary">A welcome email with login credentials will be sent to the user's email address.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button onClick={() => { toast('User created successfully'); setShowCreate(false); }} className="btn-primary flex-1 py-2.5">Create User</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${confirmDelete?.name}? This action cannot be undone and will remove all associated data.`}
        confirmLabel="Delete User"
        confirmColor="#EF4444"
        onConfirm={() => { if (confirmDelete) deleteUser(confirmDelete.id); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
      <ConfirmDialog
        open={!!confirmSuspend}
        title="Suspend Account"
        message={`Suspend ${confirmSuspend?.name}'s account? They will lose access to the portal immediately.`}
        confirmLabel="Suspend"
        confirmColor="#F59E0B"
        onConfirm={() => { if (confirmSuspend) toggleStatus(confirmSuspend.id, false); setConfirmSuspend(null); }}
        onCancel={() => setConfirmSuspend(null)}
      />
    </div>
  );
}
