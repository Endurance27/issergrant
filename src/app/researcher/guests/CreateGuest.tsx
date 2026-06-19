import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Loader2, X, Copy, Check } from 'lucide-react'
import { useCreateGuest } from '../../../hooks/useCreateGuest'
import { useAuthStore } from '../../../store/auth.store'
import { useToast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { PageHeader } from '../../components/ui/PageHeader'

const DEPARTMENTS = [
  'Macroeconomic Policy','Trade and Development','Public Finance',
  'Poverty and Inequality','Labour Economics','Education','Health',
  'Gender Studies','Governance','Social Protection and Development Policy',
  'Survey Design and Implementation','Statistical Analysis',
  'Data Management','Research Methods and Data Visualization',
]

const createGuestSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  department: Yup.string().required('Department is required'),
  staffId: Yup.string().trim().required('Staff / Guest ID is required'),
  phoneContact: Yup.string().trim().required('Phone number is required'),
  notes: Yup.string().max(500, 'Notes cannot exceed 500 characters'),
})

interface CreateGuestFormValues {
  name: string; email: string; department: string
  staffId: string; phoneContact: string; notes: string
}

interface TempResult { name: string; email: string; temporaryPassword: string }

export function CreateGuest() {
  const currentUser = useAuthStore((s) => s.user)
  const { createGuest, loading } = useCreateGuest()
  const { toast } = useToast()
  const [tempResult, setTempResult] = useState<TempResult | null>(null)
  const [apiError, setApiError] = useState('')
  const [copied, setCopied] = useState(false)

  const formik = useFormik<CreateGuestFormValues>({
    initialValues: { name:'', email:'', department: DEPARTMENTS[0], staffId:'', phoneContact:'', notes:'' },
    validationSchema: createGuestSchema,
    onSubmit: async (values, { resetForm }) => {
      setApiError('')
      const payload = await createGuest({
        ...values,
        assignedResearcherId: currentUser?.id ?? '',
      })
      if (!payload) { setApiError('Failed to create guest. Please try again.'); return }
      if (!payload.success) { setApiError(payload.message); return }
      toast(`${values.name} added as guest`, 'success')
      resetForm()
      if (payload.temporaryPassword) {
        setTempResult({ name: values.name, email: values.email, temporaryPassword: payload.temporaryPassword })
      }
    },
  })

  const inputCls = 'w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground focus:border-primary/50 transition-colors'
  const labelCls = 'block text-xs font-semibold text-foreground mb-1.5'
  const errCls = 'text-xs text-red-500 mt-1'

  return (
    <div>
      <PageHeader title="Add Guest Collaborator" subtitle="Invite an external collaborator to view assigned funding calls and proposals" />

      <div className="max-w-2xl">
        <div className="rounded-2xl bg-card border border-border p-6">
          <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                <input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. Kofi Agyeman" className={inputCls} disabled={loading} />
                {formik.touched.name && formik.errors.name && <p className={errCls}>{formik.errors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                <input name="email" type="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="guest@institution.edu" className={inputCls} disabled={loading} />
                {formik.touched.email && formik.errors.email && <p className={errCls}>{formik.errors.email}</p>}
              </div>
            </div>

            <div>
              <label className={labelCls}>Department <span className="text-red-500">*</span></label>
              <select name="department" value={formik.values.department} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputCls} disabled={loading}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {formik.touched.department && formik.errors.department && <p className={errCls}>{formik.errors.department}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Staff / Guest ID <span className="text-red-500">*</span></label>
                <input name="staffId" value={formik.values.staffId} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. GUE-001" className={inputCls} disabled={loading} />
                {formik.touched.staffId && formik.errors.staffId && <p className={errCls}>{formik.errors.staffId}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                <input name="phoneContact" value={formik.values.phoneContact} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="+233 XX XXX XXXX" className={inputCls} disabled={loading} />
                {formik.touched.phoneContact && formik.errors.phoneContact && <p className={errCls}>{formik.errors.phoneContact}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`${labelCls} mb-0`}>Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
                <span className="text-[11px] text-muted-foreground">{formik.values.notes.length}/500</span>
              </div>
              <textarea name="notes" rows={3} value={formik.values.notes} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. Lead statistician for the household survey component..." className={`${inputCls} resize-none`} disabled={loading} />
              {formik.touched.notes && formik.errors.notes && <p className={errCls}>{formik.errors.notes}</p>}
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted border border-border text-[12px] text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">i</span>
              This guest will be assigned to you automatically. Role is set to "Guest".
            </div>

            {apiError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
                <X size={14} className="flex-shrink-0" />{apiError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => formik.resetForm()} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">Clear</button>
              <button type="submit" disabled={loading || formik.isSubmitting} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>
                {loading ? <><Loader2 size={14} className="animate-spin" />Adding…</> : 'Add Guest'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Temporary password modal */}
      <Modal open={!!tempResult} onClose={() => setTempResult(null)} title="Guest Created Successfully" width={480}>
        {tempResult && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-muted">
              <div className="font-bold text-[13px] text-foreground">{tempResult.name}</div>
              <div className="text-xs text-muted-foreground">{tempResult.email}</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Temporary Password</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
                <code className="flex-1 font-mono text-[13px] text-foreground break-all">{tempResult.temporaryPassword}</code>
                <button onClick={async () => { await navigator.clipboard.writeText(tempResult.temporaryPassword); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors flex-shrink-0">
                  {copied ? <><Check size={12} className="text-green-500" /><span className="text-green-500">Copied!</span></> : <><Copy size={12} />Copy</>}
                </button>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-secondary border border-primary/20">
              <p className="text-xs text-primary">Share this temporary password with the guest. They will be prompted to change it on first login.</p>
            </div>
            <button onClick={() => setTempResult(null)} className="w-full py-2.5 rounded-xl text-white font-semibold text-[13px]" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  )
}
