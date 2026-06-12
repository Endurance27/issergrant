import { useFormik } from 'formik'
import { Modal } from '../ui/Modal'
import { useToast } from '../ui/Toast'
import { useAuthStore } from '../../../store/auth.store'
import { useCreateAssistantResearcher } from '../../../hooks/useCreateAssistantResearcher'
import { assistantResearcherSchema } from '../../../schemas/assistantResearcher.schema'

const DEPARTMENTS = [
  'Macroeconomic Policy', 'Trade and Development', 'Public Finance',
  'Poverty and Inequality', 'Labour Economics', 'Education', 'Health',
  'Gender Studies', 'Governance', 'Social Protection and Development Policy',
  'Survey Design and Implementation', 'Statistical Analysis',
  'Data Management', 'Research Methods and Data Visualization',
]

interface AssistantResearcherFormValues {
  name: string
  email: string
  department: string
  staffId: string
  phoneContact: string
  resourceId: string
  resourceTitle: string
  assignmentType: 'proposal'
  notes: string
}

interface AssistantResearcherFormProps {
  open: boolean
  onClose: () => void
}

export function AssistantResearcherForm({ open, onClose }: AssistantResearcherFormProps) {
  const currentUser = useAuthStore((s) => s.user)
  const currentRole = currentUser?.role ?? 'researcher'
  // Auto-bind the logged-in researcher's real ID from Zustand
  const assignedTo = currentUser?.id ?? 'current-researcher'

  const { toast } = useToast()
  const { createAssistantResearcher, loading, error } = useCreateAssistantResearcher()

  const formik = useFormik<AssistantResearcherFormValues>({
    initialValues: {
      name: '',
      email: '',
      department: DEPARTMENTS[0],
      staffId: '',
      phoneContact: '',
      resourceId: '',
      resourceTitle: '',
      assignmentType: 'proposal',
      notes: '',
    },
    validationSchema: assistantResearcherSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const result = await createAssistantResearcher({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        department: values.department,
        role: 'assistant_researcher',
        phoneContact: values.phoneContact.trim(),
        staffId: values.staffId.trim(),
        assignedTo,
        notes: values.notes || null,
        resourceId: values.resourceId.trim(),
        assignmentType: 'proposal',
        resourceTitle: values.resourceTitle.trim(),
      })

      setSubmitting(false)

      if (result) {
        toast(`${result.name} added as Assistant Researcher`, 'success')
        resetForm()
        onClose()
      }
    },
  })

  return (
    <Modal open={open} onClose={onClose} title="Add Assistant Researcher" width={560}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Dr. Jane Smith"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="jane@iser.edu"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Department</label>
            <select
              name="department"
              value={formik.values.department}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            >
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            {formik.touched.department && formik.errors.department && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.department}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Staff ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="staffId"
              value={formik.values.staffId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="ISER-001"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {formik.touched.staffId && formik.errors.staffId && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.staffId}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Phone Contact <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneContact"
              value={formik.values.phoneContact}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="+256 700 000000"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {formik.touched.phoneContact && formik.errors.phoneContact && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.phoneContact}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Resource ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="resourceId"
              value={formik.values.resourceId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="RES-001"
              className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
            />
            {formik.touched.resourceId && formik.errors.resourceId && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.resourceId}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Resource Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="resourceTitle"
            value={formik.values.resourceTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Research proposal title"
            className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground"
          />
          {formik.touched.resourceTitle && formik.errors.resourceTitle && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.resourceTitle}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Notes</label>
          <textarea
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Optional notes..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground resize-none"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {error.message}
          </div>
        )}

        <div className="p-3 rounded-xl bg-secondary border border-primary/20">
          <p className="text-xs text-primary">A welcome email with login credentials will be sent to the assistant researcher's email address.</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button
            type="submit"
            disabled={formik.isSubmitting || loading}
            onClick={() => formik.handleSubmit()}
            className="btn-primary flex-1 py-2.5 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating...' : 'Add Assistant Researcher'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
