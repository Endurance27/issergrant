import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Loader2 } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { useAssignGuest } from '../../../hooks/useAssignGuest'
import { useToast } from '../../components/ui/Toast'

interface AssignModalProps {
  open: boolean
  onClose: () => void
  guests: { id: string; name: string }[]
  fundingCalls: { id: string; theme: string }[]
  preselectedGuestId?: string
  preselectedFundingCallId?: string
  onSuccess?: () => void
}

const schema = Yup.object({
  guestId: Yup.string().required('Please select a guest'),
  fundingCallId: Yup.string().required('Please select a funding call'),
  notes: Yup.string().max(300),
})

export function AssignGuestToFundingCallModal({
  open, onClose, guests, fundingCalls,
  preselectedGuestId = '', preselectedFundingCallId = '', onSuccess,
}: AssignModalProps) {
  const { assignGuest, loading } = useAssignGuest()
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: { guestId: preselectedGuestId, fundingCallId: preselectedFundingCallId, notes: '' },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const result = await assignGuest({ guestId: values.guestId, fundingCallId: values.fundingCallId, notes: values.notes || undefined })
      if (!result) { toast('Failed to assign guest', 'error'); return }
      toast('Guest assigned to funding call', 'success')
      resetForm()
      onSuccess?.()
      onClose()
    },
  })

  const inputCls = 'w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground focus:border-primary/50 transition-colors'

  return (
    <Modal open={open} onClose={onClose} title="Assign Guest to Funding Call" width={480}>
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Guest <span className="text-red-500">*</span></label>
          <select name="guestId" value={formik.values.guestId} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputCls}>
            <option value="">— Select a guest —</option>
            {guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          {formik.touched.guestId && formik.errors.guestId && <p className="text-xs text-red-500 mt-1">{formik.errors.guestId}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Funding Call <span className="text-red-500">*</span></label>
          <select name="fundingCallId" value={formik.values.fundingCallId} onChange={formik.handleChange} onBlur={formik.handleBlur} className={inputCls}>
            <option value="">— Select a funding call —</option>
            {fundingCalls.map(fc => <option key={fc.id} value={fc.id}>{fc.theme}</option>)}
          </select>
          {formik.touched.fundingCallId && formik.errors.fundingCallId && <p className="text-xs text-red-500 mt-1">{formik.errors.fundingCallId}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
          <textarea name="notes" rows={3} value={formik.values.notes} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="e.g. Guest will handle data collection..." className={`${inputCls} resize-none`} />
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>
            {loading ? <><Loader2 size={14} className="animate-spin" />Assigning…</> : 'Assign Guest'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
