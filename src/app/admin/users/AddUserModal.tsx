import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import type { Role } from "../../data/mockData";
import type { FormikErrors, FormikTouched } from "formik";
import type { CreateUserFormValues } from "../../../types/forms";

const ROLE_COLORS: Record<Role, string> = {
  'Admin': '#1A3363',
  'Director': '#1A4A7A',
  'Researcher': '#2D6EA8',
  'Finance Officer': '#403C3A',
  'Guest': '#B79A64',
};

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

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  newName: string;
  newEmail: string;
  newRole: Role;
  newDept: string;
  newStaffId: string;
  newPhoneContact: string;
  formError: string;
  allowedRoles: Role[];
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onRoleChange: (v: Role) => void;
  onDeptChange: (v: string) => void;
  onStaffIdChange: (v: string) => void;
  onPhoneContactChange: (v: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  touched?: FormikTouched<CreateUserFormValues>;
  errors?: FormikErrors<CreateUserFormValues>;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function AddUserModal({
  open, onClose, newName, newEmail, newRole, newDept, newStaffId, newPhoneContact, formError, allowedRoles,
  onNameChange, onEmailChange, onRoleChange, onDeptChange, onStaffIdChange, onPhoneContactChange, onSubmit,
  isSubmitting = false, touched = {}, errors = {}, onBlur,
}: AddUserModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Add New User" width={520}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={newName}
              onChange={e => onNameChange(e.target.value)}
              onBlur={onBlur}
              placeholder="Dr. Jane Smith"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {touched.name && errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={newEmail}
              onChange={e => onEmailChange(e.target.value)}
              onBlur={onBlur}
              placeholder="jane@iser.edu"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Role</label>
            <select
              name="role"
              value={newRole}
              onChange={e => onRoleChange(e.target.value as Role)}
              onBlur={onBlur}
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            >
              {allowedRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Department</label>
            <select
              name="department"
              value={newDept}
              onChange={e => onDeptChange(e.target.value)}
              onBlur={onBlur}
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            >
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Staff ID <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="staffId"
              value={newStaffId}
              onChange={e => onStaffIdChange(e.target.value)}
              onBlur={onBlur}
              placeholder="ISER-001"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {touched.staffId && errors.staffId && (
              <p className="text-xs text-red-500 mt-1">{errors.staffId}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Phone Contact <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phoneContact"
              value={newPhoneContact}
              onChange={e => onPhoneContactChange(e.target.value)}
              onBlur={onBlur}
              placeholder="+256 700 000000"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {touched.phoneContact && errors.phoneContact && (
              <p className="text-xs text-red-500 mt-1">{errors.phoneContact}</p>
            )}
          </div>
        </div>

        {newName && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
            <div className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm flex-shrink-0" style={{ background: ROLE_COLORS[newRole] || '#1A3363' }}>
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
          <button onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => onSubmit()}
            className="btn-primary flex-1 py-2.5 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
