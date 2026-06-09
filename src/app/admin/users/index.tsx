import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toast";
import { PageHeader } from "../../components/ui/PageHeader";
import { usePagination } from "../../hooks/usePagination";
import { useSortable } from "../../hooks/useSortable";
import { useAppContext } from "../../context/AppContext";
import { users as initialUsers, currentUsers } from "../../data/mockData";
import type { User, Role } from "../../data/mockData";
import { fetchUsers, deleteUser as deleteUserSvc, updateUserStatus } from "../services/userService";
import { RoleSummaryCards } from "./RoleSummaryCards";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { UserCardList } from "./UserCard";
import { AddUserModal } from "./AddUserModal";
import { TemporaryPasswordModal } from "../../components/ui/TemporaryPasswordModal";
import { useCreateUser } from "../../../hooks/useCreateUser";
import type { UserRole } from "../../../gql/graphql";

const DEPARTMENTS = [
  // Economics Division
  'Macroeconomic Policy',
  'Trade and Development',
  'Public Finance',
  'Poverty and Inequality',
  'Labour Economics',
  // Social Division
  'Education',
  'Health',
  'Gender Studies',
  'Governance',
  'Social Protection and Development Policy',
  // Statistics and Survey Division
  'Survey Design and Implementation',
  'Statistical Analysis',
  'Data Management',
  'Research Methods and Data Visualization',
];

// Admin can only add Researcher and Finance Officer
const ALLOWED_ROLES: Role[] = ['Researcher', 'Finance Officer'];

export function UserManagementPage() {
  const { addNotification, addAuditLog } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
        if (data && data.length > 0) {
          setUsers(data);
        } else {
          setUsers(initialUsers);
        }
      } catch {
        setUsers(initialUsers);
      }
    };
    load();
  }, []);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>(ALLOWED_ROLES[0]);
  const [newDept, setNewDept] = useState(DEPARTMENTS[0]);
  const [newStaffId, setNewStaffId] = useState('');
  const [newPhoneContact, setNewPhoneContact] = useState('');
  const [formError, setFormError] = useState('');

  const [tempPasswordData, setTempPasswordData] = useState<{ name: string; email: string; temporaryPassword: string } | null>(null);

  const { toast } = useToast();
  const { createUser: createUserMutation, loading: creating } = useCreateUser();

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
    await updateUserStatus(id, newStatus as 'Active' | 'Suspended');
    addAuditLog({ action: wasActive ? 'Account Suspended' : 'Account Activated', user: currentUsers['Admin'].name, role: 'Admin', module: 'User Management', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), ip: '192.168.1.1', details: u?.name || '' });
    toast(wasActive ? 'Account suspended' : 'Account activated', wasActive ? 'warning' : 'success');
  };

  const handleDelete = async (id: number) => {
    const u = users.find(u => u.id === id);
    setUsers(prev => prev.filter(u => u.id !== id));
    await deleteUserSvc(id);
    addAuditLog({ action: 'User Deleted', user: currentUsers['Admin'].name, role: 'Admin', module: 'User Management', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), ip: '192.168.1.1', details: u?.name || '' });
    toast('User deleted', 'error');
  };

  const handleCreate = async () => {
    setFormError('');
    if (!newName.trim()) { setFormError('Full name is required.'); return; }
    if (!newEmail.trim() || !newEmail.includes('@')) { setFormError('A valid email address is required.'); return; }
    if (users.find(u => u.email.toLowerCase() === newEmail.toLowerCase())) { setFormError('A user with this email already exists.'); return; }
    if (!newStaffId.trim()) { setFormError('Staff ID is required.'); return; }
    if (!newPhoneContact.trim()) { setFormError('Phone contact is required.'); return; }

    const initials = newName.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    try {
      const result = await createUserMutation({
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole as UserRole,
        department: newDept,
        staffId: newStaffId.trim(),
        phoneContact: newPhoneContact.trim(),
      });

      if (!result) {
        setFormError('Failed to create user. Please try again.');
        return;
      }

      const newUser: User = {
        id: result.user.id as unknown as number,
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        status: 'Active',
        department: newDept,
        joined: new Date().toISOString().slice(0, 10),
        avatar: result.user.avatar || initials,
      };

      setUsers(prev => [newUser, ...prev]);
      addNotification({ title: 'New User Added', message: `${newUser.name} (${newRole}) has been added to the system.`, time: 'Just now', type: 'system' });
      addAuditLog({ action: 'User Created', user: currentUsers['Admin'].name, role: 'Admin', module: 'User Management', timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), ip: '192.168.1.1', details: `${newUser.name} — ${newRole} — ${newDept}` });
      toast(`${newUser.name} added successfully`);
      setShowCreate(false);
      setNewName(''); setNewEmail(''); setNewRole(ALLOWED_ROLES[0]); setNewDept(DEPARTMENTS[0]); setNewStaffId(''); setNewPhoneContact(''); setFormError('');

      setTempPasswordData({
        name: newUser.name,
        email: newUser.email,
        temporaryPassword: result.temporaryPassword,
      });
    } catch {
      setFormError('Failed to save user. Please try again.');
    }
  };

  const openCreate = () => {
    setNewName(''); setNewEmail(''); setNewRole(ALLOWED_ROLES[0]); setNewDept(DEPARTMENTS[0]);
    setNewStaffId(''); setNewPhoneContact(''); setFormError(''); setShowCreate(true);
  };

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

      <RoleSummaryCards users={users} roleFilter={roleFilter} onRoleFilter={r => { setRoleFilter(r); setPage(1); }} />

      <UserFilters search={search} roleFilter={roleFilter} onSearch={v => { setSearch(v); setPage(1); }} onRoleFilter={r => { setRoleFilter(r); setPage(1); }} />

      <UserTable
        paginated={paginated}
        filtered={filtered}
        sortKey={sortKey as string}
        dir={dir}
        onToggle={toggle}
        activeMenu={activeMenu}
        onMenuToggle={id => setActiveMenu(activeMenu === id ? null : id)}
        onSuspend={u => { setConfirmSuspend(u); setActiveMenu(null); }}
        onActivate={id => { toggleStatus(id, false); setActiveMenu(null); }}
        onDelete={u => { setConfirmDelete(u); setActiveMenu(null); }}
        page={page}
        totalPages={totalPages}
        onPage={setPage}
        search={search}
      />

      <UserCardList
        paginated={paginated}
        filtered={filtered}
        page={page}
        totalPages={totalPages}
        onPage={setPage}
        onSuspend={u => setConfirmSuspend(u)}
        onActivate={id => toggleStatus(id, false)}
        onDelete={u => setConfirmDelete(u)}
      />

      <AddUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        newName={newName}
        newEmail={newEmail}
        newRole={newRole}
        newDept={newDept}
        newStaffId={newStaffId}
        newPhoneContact={newPhoneContact}
        formError={creating ? 'Creating user…' : formError}
        onNameChange={v => { setNewName(v); setFormError(''); }}
        onEmailChange={v => { setNewEmail(v); setFormError(''); }}
        allowedRoles={ALLOWED_ROLES}
        onRoleChange={setNewRole}
        onDeptChange={setNewDept}
        onStaffIdChange={v => { setNewStaffId(v); setFormError(''); }}
        onPhoneContactChange={v => { setNewPhoneContact(v); setFormError(''); }}
        onSubmit={handleCreate}
      />

      {tempPasswordData && (
        <TemporaryPasswordModal
          open={!!tempPasswordData}
          onClose={() => setTempPasswordData(null)}
          name={tempPasswordData.name}
          email={tempPasswordData.email}
          temporaryPassword={tempPasswordData.temporaryPassword}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${confirmDelete?.name}? This cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="#EF4444"
        onConfirm={() => { if (confirmDelete) handleDelete(confirmDelete.id); setConfirmDelete(null); }}
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
