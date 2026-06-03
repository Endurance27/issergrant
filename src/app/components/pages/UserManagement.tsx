import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Plus, Search, MoreHorizontal, ShieldCheck, ShieldOff, Trash2, Users, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Pagination } from "../ui/Pagination";
import { useToast } from "../ui/Toast";
import { ScrollTable } from "../ui/ScrollTable";
import { PageHeader } from "../ui/PageHeader";
import { usePagination } from "../../hooks/usePagination";
import { useSortable } from "../../hooks/useSortable";
import { useAppContext } from "../../context/AppContext";
import { users as initialUsers, currentUsers } from "../../data/mockData";
import type { User, Role } from "../../data/mockData";

const ROLE_COLORS: Record<Role, string> = {
  'Admin': '#1A3363',
  'Researcher': '#2D6EA8',
  'Assistant Researcher': '#B79A64',
  'Finance Officer': '#403C3A',
};

const DEPARTMENTS = [
  'Administration', 'Biomedical Engineering', 'Computer Science',
  'Environmental Science', 'Physics', 'Finance & Accounts', 'Education',
];

const ROLES: Role[] = ['Researcher', 'Assistant Researcher', 'Finance Officer', 'Admin'];

const TH = ({ label, sortKey, active, dir, onToggle }: { label: string; sortKey?: string; active?: boolean; dir?: 'asc' | 'desc'; onToggle?: () => void }) => (
  <th onClick={onToggle} className={`text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-[0.05em] select-none ${onToggle ? 'cursor-pointer hover:text-foreground' : ''}`}>
    <span className="flex items-center gap-1">
      {label}
      {onToggle && (active ? (dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />) : <ChevronUp size={11} className="opacity-20" />)}
    </span>
  </th>
);

export function UserManagement() {
  const { addNotification, addAuditLog } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);

  // Load users from Supabase on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*').order('joined', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          setUsers(data as User[]);
        } else {
          setUsers(initialUsers);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers(initialUsers);
      }
    };
    fetchUsers();
  }, []);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Controlled form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>('Researcher');
  const [newDept, setNewDept] = useState(DEPARTMENTS[0]);
  const [formError, setFormError] = useState('');

  const { toast } = useToast();

  const allRoles = ['All', ...ROLES];
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const { sorted, sortKey, dir, toggle } = useSortable(filtered as unknown as Record<string, unknown>[], 'name' as any);
  const { paginated, page, totalPages, setPage } = usePagination(sorted as unknown as User[], 8);

  const activeCount = users.filter(u => u.status === 'Active').length;
  const deptCount = new Set(users.map(u => u.department)).size;

  const toggleStatus = async (id: number, wasActive: boolean) => {
    const u = users.find(u => u.id === id);
    const newStatus = wasActive ? 'Suspended' : 'Active';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    await supabase.from('users').update({ status: newStatus }).eq('id', id);
    addAuditLog({ action: wasActive ? 'Account Suspended' : 'Account Activated', user: currentUsers['Admin'].name, role: 'Admin', module: 'User Management', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), ip: '192.168.1.1', details: u?.name || '' });
    toast(wasActive ? 'Account suspended' : 'Account activated', wasActive ? 'warning' : 'success');
  };

  const deleteUser = async (id: number) => {
    const u = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    await supabase.from('users').delete().eq('id', id);
    addAuditLog({ action: 'User Deleted', user: currentUsers['Admin'].name, role: 'Admin', module: 'User Management', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), ip: '192.168.1.1', details: u?.name || '' });
    toast('User deleted', 'error');
  };

  const createUser = async () => {
    setFormError('');
    if (!newName.trim()) { setFormError('Full name is required.'); return; }
    if (!newEmail.trim() || !newEmail.includes('@')) { setFormError('A valid email address is required.'); return; }
    if (users.find(u => u.email.toLowerCase() === newEmail.toLowerCase())) { setFormError('A user with this email already exists.'); return; }

    const initials = newName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser = {
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      status: 'Active',
      department: newDept,
      joined: new Date().toISOString().slice(0, 10),
      avatar: initials,
    };

    const { data, error } = await supabase.from('users').insert([newUser]).select().single();
    if (error) {
      console.error("Error saving user:", error);
      setFormError('Failed to save user. Please try again.');
      return;
    }

    setUsers(prev => [data as User, ...prev]);
    addNotification({ title: 'New User Added', message: `${newUser.name} (${newRole}) has been added to the system.`, time: 'Just now', type: 'system' });
    addAuditLog({ action: 'User Created', user: currentUsers['Admin'].name, role: 'Admin', module: 'User Management', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), ip: '192.168.1.1', details: `${newUser.name} — ${newRole} — ${newDept}` });
    toast(`${newUser.name} added successfully`);
    setShowCreate(false);
    setNewName(''); setNewEmail(''); setNewRole('Researcher'); setNewDept(DEPARTMENTS[0]); setFormError('');
  };

  const openCreate = () => { setNewName(''); setNewEmail(''); setNewRole('Researcher'); setNewDept(DEPARTMENTS[0]); setFormError(''); setShowCreate(true); };

  return (
    <div onClick={() => setActiveMenu(null)}>
      <PageHeader
        title="User Management"
        subtitle={`${activeCount} active users across ${deptCount} departments`}
        action={
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add User
          </button>
        }
      />

      {/* Role summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {ROLES.map(role => {
          const count = users.filter(u => u.role === role).length;
          const isActive = roleFilter === role;
          return (
            <button key={role} onClick={() => setRoleFilter(isActive ? 'All' : role)}
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

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 flex-1 bg-card border border-border focus-within:border-primary/50 transition-colors">
          <Search size={15} className="text-muted-foreground flex-shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, or department..." className="bg-transparent outline-none flex-1 text-[13px] text-foreground min-w-0" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allRoles.map(r => (
            <button key={r} onClick={e => { e.stopPropagation(); setRoleFilter(r); setPage(1); }}
              className={`px-3 py-2 rounded-xl transition-all text-xs border whitespace-nowrap ${roleFilter === r ? 'border-primary bg-primary text-white font-semibold shadow-sm' : 'border-border bg-card text-muted-foreground font-medium hover:bg-muted'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
        <ScrollTable>
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                <TH label="User" sortKey="name" active={sortKey === 'name'} dir={dir} onToggle={() => toggle('name')} />
                <TH label="Role" sortKey="role" active={sortKey === 'role'} dir={dir} onToggle={() => toggle('role')} />
                <TH label="Department" sortKey="department" active={sortKey === 'department'} dir={dir} onToggle={() => toggle('department')} />
                <TH label="Joined" sortKey="joined" active={sortKey === 'joined'} dir={dir} onToggle={() => toggle('joined')} />
                <TH label="Status" sortKey="status" active={sortKey === 'status'} dir={dir} onToggle={() => toggle('status')} />
                <TH label="" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.map(u => (
                <tr key={u.id} className="bg-card hover:bg-muted transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 text-white font-bold text-xs" style={{ background: ROLE_COLORS[u.role] }}>{u.avatar}</div>
                      <div className="min-w-0">
                        <div className="font-bold text-[13px] text-foreground truncate">{u.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge status={u.role} size="sm" /></td>
                  <td className="px-4 py-3"><span className="text-xs text-muted-foreground whitespace-nowrap">{u.department}</span></td>
                  <td className="px-4 py-3"><span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">{u.joined}</span></td>
                  <td className="px-4 py-3"><Badge status={u.status} size="sm" /></td>
                  <td className="px-4 py-3">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setActiveMenu(activeMenu === u.id ? null : u.id)}
                        className="flex items-center justify-center rounded-lg p-1.5 transition-colors text-muted-foreground hover:bg-muted">
                        <MoreHorizontal size={16} />
                      </button>
                      {activeMenu === u.id && (
                        <div className="absolute right-0 top-full mt-1 min-w-[190px] rounded-xl shadow-xl z-30 overflow-hidden bg-card border border-border">
                          {u.status === 'Active' ? (
                            <button onClick={() => { setConfirmSuspend(u); setActiveMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-left text-[13px] hover:bg-muted text-amber-500">
                              <ShieldOff size={14} /> Suspend Account
                            </button>
                          ) : (
                            <button onClick={() => { toggleStatus(u.id, false); setActiveMenu(null); }}
                              className="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-left text-[13px] hover:bg-muted text-green-500">
                              <ShieldCheck size={14} /> Activate Account
                            </button>
                          )}
                          <div className="h-px bg-border mx-2" />
                          <button onClick={() => { setConfirmDelete(u); setActiveMenu(null); }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-left text-[13px] hover:bg-muted text-red-500">
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
            <div className="font-bold text-sm text-foreground">No users found</div>
            <div className="text-xs text-muted-foreground mt-1">{search ? `No results for "${search}"` : 'Try a different filter'}</div>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={8} onPage={setPage} />
      </div>

      {/* Mobile card list */}
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
                <button onClick={() => setConfirmSuspend(u)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-500 bg-amber-50 border border-amber-300">
                  <ShieldOff size={12} /> Suspend
                </button>
              ) : (
                <button onClick={() => toggleStatus(u.id, false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-500 bg-green-50 border border-green-300">
                  <ShieldCheck size={12} /> Activate
                </button>
              )}
              <button onClick={() => setConfirmDelete(u)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 border border-red-300">
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
          <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={8} onPage={setPage} />
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add New User" width={520}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newName}
                onChange={e => { setNewName(e.target.value); setFormError(''); }}
                placeholder="Dr. Jane Smith"
                className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={newEmail}
                onChange={e => { setNewEmail(e.target.value); setFormError(''); }}
                placeholder="jane@iser.edu"
                className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Role</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as Role)}
                className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Department</label>
              <select
                value={newDept}
                onChange={e => setNewDept(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
              >
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Preview */}
          {newName && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm flex-shrink-0" style={{ background: ROLE_COLORS[newRole] }}>
                {newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <div className="font-bold text-[13px] text-foreground">{newName}</div>
                <div className="text-xs text-muted-foreground">{newRole} · {newDept}</div>
              </div>
              <Badge status="Active" size="sm" />
            </div>
          )}

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">{formError}</div>
          )}

          <div className="p-3 rounded-xl bg-secondary border border-primary/20">
            <p className="text-xs text-primary">A welcome email with login credentials will be sent to the user's email address.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button onClick={createUser} className="btn-primary flex-1 py-2.5">Create User</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${confirmDelete?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="#EF4444"
        onConfirm={() => { if (confirmDelete) deleteUser(confirmDelete.id); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
      <ConfirmDialog
        open={!!confirmSuspend}
        title="Suspend Account"
        message={`Suspend ${confirmSuspend?.name}'s account? They will lose access immediately.`}
        confirmLabel="Suspend"
        confirmColor="#F59E0B"
        onConfirm={() => { if (confirmSuspend) toggleStatus(confirmSuspend.id, true); setConfirmSuspend(null); }}
        onCancel={() => setConfirmSuspend(null)}
      />
    </div>
  );
}
