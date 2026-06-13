import { useState } from "react";
import { useFormik } from "formik";
import { useMutation } from "@apollo/client/react";
import { createUserSchema } from "../../../schemas/user.schema";
import type { CreateUserFormValues } from "../../../types/forms";
import { Plus, Loader2 } from "lucide-react";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/Toast";
import { PageHeader } from "../../components/ui/PageHeader";
import { usePagination } from "../../../hooks/usePagination";
import { useSortable } from "../../../hooks/useSortable";
import { useAppContext } from "../../context/AppContext";
import { useAuthStore } from "../../../store/auth.store";
import { useUsers } from "../../../hooks/useUsers";
import { UPDATE_USER_STATUS_MUTATION } from "../../../apollo/mutations";
import type { Role } from "../../data/mockData";
import type { User as LocalUser } from "../../data/mockData";
import type { UserRole } from "../../../gql/graphql";
import { RoleSummaryCards } from "./RoleSummaryCards";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { UserCardList } from "./UserCard";
import { AddUserModal } from "./AddUserModal";
import { TemporaryPasswordModal } from "../../components/ui/TemporaryPasswordModal";
import { useCreateUser } from "../../../hooks/useCreateUser";

const DEPARTMENTS = [
  // Economics Division
  "Macroeconomic Policy",
  "Trade and Development",
  "Public Finance",
  "Poverty and Inequality",
  "Labour Economics",
  // Social Division
  "Education",
  "Health",
  "Gender Studies",
  "Governance",
  "Social Protection and Development Policy",
  // Statistics and Survey Division
  "Survey Design and Implementation",
  "Statistical Analysis",
  "Data Management",
  "Research Methods and Data Visualization",
];

// Admin can only add Researcher and Finance Officer
const ALLOWED_ROLES: Role[] = ["Researcher", "Finance Officer"];

const ROLE_DISPLAY: Record<string, Role> = {
  admin: "Admin",
  researcher: "Researcher",
  assistant_researcher: "Assistant Researcher",
  finance_officer: "Finance Officer",
  director: "Director",
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function toLocalUser(u: {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string | null;
  department: string;
  avatar?: string | null;
  createdAt?: string;
  joined?: string;
}): LocalUser {
  return {
    id: u.id as unknown as number,
    name: u.name,
    email: u.email,
    role: ROLE_DISPLAY[u.role] ?? "Researcher",
    status: ((u.status ?? "Active") === "Active" ? "Active" : "Suspended") as
      | "Active"
      | "Suspended",
    department: u.department,
    joined: u.createdAt?.slice(0, 10) ?? u.joined ?? "—",
    avatar: u.avatar ?? getInitials(u.name),
  };
}

export function UserManagementPage() {
  const { addNotification, addAuditLog } = useAppContext();
  const { user: authUser } = useAuthStore();
  const adminName = authUser?.name ?? authUser?.email ?? "Admin";

  const { users: remoteUsers, loading, error, refetch } = useUsers();
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [updateUser] = useMutation(UPDATE_USER_STATUS_MUTATION);

  const users: LocalUser[] = remoteUsers
    .filter((u) => !deletedIds.has(u.id))
    .map(toLocalUser);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LocalUser | null>(null);
  const [confirmSuspend, setConfirmSuspend] = useState<LocalUser | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formError, setFormError] = useState("");

  const [tempPasswordData, setTempPasswordData] = useState<{
    name: string;
    email: string;
    temporaryPassword: string;
  } | null>(null);

  const { toast } = useToast();
  const { createUser: createUserMutation, loading: creating } = useCreateUser();

  const formik = useFormik<CreateUserFormValues>({
    initialValues: {
      name: "",
      email: "",
      role: ALLOWED_ROLES[0],
      department: DEPARTMENTS[0],
      staffId: "",
      phoneContact: "",
    },
    validationSchema: createUserSchema,
    onSubmit: async (values, { resetForm }) => {
      setFormError("");
      if (
        users.find((u) => u.email.toLowerCase() === values.email.toLowerCase())
      ) {
        setFormError("A user with this email already exists.");
        return;
      }
      try {
        const result = await createUserMutation({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          role: values.role as unknown as UserRole,
          department: values.department,
          staffId: values.staffId.trim(),
          phoneContact: values.phoneContact.trim(),
        });
        if (!result) {
          setFormError("Failed to create user. Please try again.");
          return;
        }
        await refetch();
        addNotification({
          title: "New User Added",
          message: `${values.name.trim()} (${values.role}) has been added to the system.`,
          time: "Just now",
          type: "system",
        });
        addAuditLog({
          action: "User Created",
          user: adminName,
          role: "Admin",
          module: "User Management",
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
          ip: "192.168.1.1",
          details: `${values.name.trim()} — ${values.role} — ${values.department}`,
        });
        toast(`${values.name.trim()} added successfully`);
        setShowCreate(false);
        resetForm();
        setTempPasswordData({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          temporaryPassword: result.temporaryPassword,
        });
      } catch {
        setFormError("Failed to save user. Please try again.");
      }
    },
  });

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q);
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const { sorted, sortKey, dir, toggle } = useSortable(
    filtered as unknown as Record<string, unknown>[],
    "name" as any,
  );
  const { paginated, page, totalPages, setPage } = usePagination(
    sorted as unknown as LocalUser[],
    8,
  );

  const activeCount = users.filter((u) => u.status === "Active").length;
  const deptCount = new Set(users.map((u) => u.department)).size;

  const toggleStatus = async (id: number, wasActive: boolean) => {
    const u = users.find((u) => u.id === id);
    const newStatus = wasActive ? "Suspended" : "Active";
    try {
      await updateUser({
        variables: { input: { userId: String(id), status: newStatus } },
      });
      await refetch();
    } catch {
      toast("Failed to update status", "error");
      return;
    }
    addAuditLog({
      action: wasActive ? "Account Suspended" : "Account Activated",
      user: adminName,
      role: "Admin",
      module: "User Management",
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      ip: "192.168.1.1",
      details: u?.name || "",
    });
    toast(
      wasActive ? "Account suspended" : "Account activated",
      wasActive ? "warning" : "success",
    );
  };

  const handleDelete = (id: number) => {
    const u = users.find((u) => u.id === id);
    setDeletedIds((prev) => new Set([...prev, String(id)]));
    addAuditLog({
      action: "User Deleted",
      user: adminName,
      role: "Admin",
      module: "User Management",
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      ip: "192.168.1.1",
      details: u?.name || "",
    });
    toast("User deleted", "error");
  };

  const openCreate = () => {
    formik.resetForm();
    setFormError("");
    setShowCreate(true);
  };

  if (loading && remoteUsers.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-64 text-muted-foreground gap-2"
        data-testid="users-loading"
      >
        <Loader2 size={20} className="animate-spin" />
        <span>Loading users…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 gap-3"
        data-testid="users-error"
      >
        <p className="text-sm text-destructive">
          Failed to load users: {error.message}
        </p>
        <button className="btn-secondary text-sm" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div onClick={() => setActiveMenu(null)}>
      <PageHeader
        title="User Management"
        subtitle={`${activeCount} active users across ${deptCount} departments`}
        action={
          <button
            onClick={openCreate}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> Add User
          </button>
        }
      />

      <RoleSummaryCards
        users={users}
        roleFilter={roleFilter}
        onRoleFilter={(r) => {
          setRoleFilter(r);
          setPage(1);
        }}
      />

      <UserFilters
        search={search}
        roleFilter={roleFilter}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onRoleFilter={(r) => {
          setRoleFilter(r);
          setPage(1);
        }}
      />

      {users.length === 0 && !loading ?
        <div
          className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2"
          data-testid="users-empty"
        >
          <p className="text-sm">No users found.</p>
        </div>
      : <>
          <UserTable
            paginated={paginated}
            filtered={filtered}
            sortKey={sortKey as string}
            dir={dir}
            onToggle={toggle}
            activeMenu={activeMenu}
            onMenuToggle={(id) => setActiveMenu(activeMenu === id ? null : id)}
            onSuspend={(u) => {
              setConfirmSuspend(u);
              setActiveMenu(null);
            }}
            onActivate={(id) => {
              toggleStatus(id, false);
              setActiveMenu(null);
            }}
            onDelete={(u) => {
              setConfirmDelete(u);
              setActiveMenu(null);
            }}
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
            onSuspend={(u) => setConfirmSuspend(u)}
            onActivate={(id) => toggleStatus(id, false)}
            onDelete={(u) => setConfirmDelete(u)}
          />
        </>
      }

      <AddUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        newName={formik.values.name}
        newEmail={formik.values.email}
        newRole={formik.values.role as Role}
        newDept={formik.values.department}
        newStaffId={formik.values.staffId}
        newPhoneContact={formik.values.phoneContact}
        formError={creating ? "Creating user…" : formError}
        onNameChange={(v) => formik.setFieldValue("name", v)}
        onEmailChange={(v) => formik.setFieldValue("email", v)}
        allowedRoles={ALLOWED_ROLES}
        onRoleChange={(v) => formik.setFieldValue("role", v)}
        onDeptChange={(v) => formik.setFieldValue("department", v)}
        onStaffIdChange={(v) => formik.setFieldValue("staffId", v)}
        onPhoneContactChange={(v) => formik.setFieldValue("phoneContact", v)}
        onSubmit={() => formik.handleSubmit()}
        isSubmitting={formik.isSubmitting || creating}
        touched={formik.touched}
        errors={formik.errors}
        onBlur={formik.handleBlur}
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
        onConfirm={() => {
          if (confirmDelete) handleDelete(confirmDelete.id);
          setConfirmDelete(null);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
      <ConfirmDialog
        open={!!confirmSuspend}
        title="Suspend Account"
        message={`Suspend ${confirmSuspend?.name}'s account? They will lose access immediately.`}
        confirmLabel="Suspend"
        confirmColor="#F59E0B"
        onConfirm={() => {
          if (confirmSuspend) toggleStatus(confirmSuspend.id, true);
          setConfirmSuspend(null);
        }}
        onCancel={() => setConfirmSuspend(null)}
      />
    </div>
  );
}
