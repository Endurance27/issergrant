import { useState } from 'react'
import { useFormik } from 'formik'
import { Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateProposalSchema } from '../../../schemas/proposal.schema'
import { useUpdateProposal } from '../../../hooks/useUpdateProposal'
import { useToast } from '../ui/Toast'
import { MultiSelect, type MultiSelectOption } from '../ui/MultiSelect'
import type { EditProposalFormValues, ProposalPI, ProposalRecord } from '../../../types/proposal.types'

interface EditProposalFormProps {
  proposal: ProposalRecord
  onSuccess?: (proposal: ProposalRecord) => void
  onCancel?: () => void
}

export function EditProposalForm({ proposal, onSuccess, onCancel }: EditProposalFormProps) {
  const { updateProposal, removeCoPi, loading } = useUpdateProposal()
  const { toast } = useToast()

  const [coPIs, setCoPIs] = useState<ProposalPI[]>(proposal.coPIs ?? [])
  const [apiMessage, setApiMessage] = useState('')
  const [apiErrors, setApiErrors] = useState<string[]>([])

  const coPiOptions: MultiSelectOption[] = coPIs.map((p) => ({ id: p.id, label: p.name, sublabel: p.department }))

  const formik = useFormik<EditProposalFormValues>({
    initialValues: {
      title: proposal.title,
      abstract: proposal.abstract,
      requestedAmount: proposal.requestedAmount,
    },
    validationSchema: updateProposalSchema,
    onSubmit: async (values) => {
      setApiMessage('')
      setApiErrors([])

      const payload = await updateProposal(proposal.id, {
        title: values.title.trim(),
        abstract: values.abstract.trim(),
        requestedAmount: Number(values.requestedAmount),
      })

      if (!payload) {
        setApiErrors(['A network error occurred. Please try again.'])
        return
      }
      if (!payload.success) {
        setApiMessage(payload.message)
        setApiErrors(payload.errors ?? [])
        return
      }

      toast('Proposal updated successfully', 'success')
      if (payload.proposal) onSuccess?.(payload.proposal)
    },
  })

  // Co-PIs can only be removed here — the backend has no mutation to add a
  // Co-PI to a proposal after it's been created.
  const handleRemoveCoPi = async (ids: string[]) => {
    const removedId = coPIs.map((p) => p.id).find((id) => !ids.includes(id))
    if (!removedId) return
    const result = await removeCoPi(proposal.id, removedId)
    if (!result?.success) {
      toast(result?.message ?? 'Failed to remove Co-PI', 'error')
      return
    }
    setCoPIs((prev) => prev.filter((p) => p.id !== removedId))
    toast('Co-PI removed', 'success')
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground focus:border-primary/50 transition-colors disabled:opacity-50'
  const labelCls = 'block text-xs font-semibold text-foreground mb-1.5'
  const errCls = 'text-xs text-red-500 mt-1'
  const abstractLen = formik.values.abstract.length

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-4" data-testid="edit-proposal-form">
      {(apiMessage || apiErrors.length > 0) && (
        <div data-testid="proposal-error-banner" className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            {apiMessage && <p className="font-semibold">{apiMessage}</p>}
            {apiErrors.length > 0 && (
              <ul className="list-disc list-inside text-[12px] mt-1 space-y-0.5">
                {apiErrors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
          <button type="button" onClick={() => { setApiMessage(''); setApiErrors([]) }} className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600">
            <X size={14} />
          </button>
        </div>
      )}

      <div>
        <label className={labelCls}>Proposal Title<span className="text-red-500 ml-0.5">*</span></label>
        <input name="title" data-testid="edit-title-input" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={loading} className={inputCls} />
        {formik.touched.title && formik.errors.title && <p className={errCls}>{formik.errors.title}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={`${labelCls} mb-0`}>Abstract<span className="text-red-500 ml-0.5">*</span></label>
          <span className={`text-[11px] ${abstractLen >= 50 ? 'text-green-600' : 'text-muted-foreground'}`}>{abstractLen} / 50 min</span>
        </div>
        <textarea name="abstract" data-testid="edit-abstract-input" rows={5} value={formik.values.abstract} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={loading} className={`${inputCls} resize-none`} />
        {formik.touched.abstract && formik.errors.abstract && <p className={errCls}>{formik.errors.abstract}</p>}
      </div>

      <div>
        <label className={labelCls}>Requested Amount (GHS)<span className="text-red-500 ml-0.5">*</span></label>
        <input type="number" name="requestedAmount" data-testid="edit-amount-input" value={formik.values.requestedAmount} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={loading} className={inputCls} />
        {formik.touched.requestedAmount && formik.errors.requestedAmount && <p className={errCls}>{formik.errors.requestedAmount as string}</p>}
      </div>

      <div>
        <label className={labelCls}>Co-Principal Investigators</label>
        <MultiSelect
          data-testid="edit-copi-multiselect"
          options={coPiOptions}
          value={coPiOptions.map((o) => o.id)}
          onChange={handleRemoveCoPi}
          allowAdd={false}
          disabled={loading}
        />
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Existing Co-PIs can be removed here. New Co-PIs can only be added when the proposal is first created.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">
            Cancel
          </button>
        )}
        <button type="submit" data-testid="save-proposal-button" disabled={loading} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}>
          {loading ? <><Loader2 size={14} className="animate-spin" />Saving…</> : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
