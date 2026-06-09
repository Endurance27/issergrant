import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { createProposalSchema } from '../../../schemas/proposal.schema'
import { useCreateProposal } from '../../../hooks/useCreateProposal'
import { useAuthContext } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import { supabase } from '../../../lib/supabase'
import type { CreateProposalFormValues } from '../../../types/proposal.types'
import type { ProposalRecord } from '../../../types/proposal.types'

// ISSER departments — kept in sync with the rest of the codebase
const DEPARTMENTS = [
  'Macroeconomic Policy',
  'Trade and Development',
  'Public Finance',
  'Poverty and Inequality',
  'Labour Economics',
  'Education',
  'Health',
  'Gender Studies',
  'Governance',
  'Social Protection and Development Policy',
  'Survey Design and Implementation',
  'Statistical Analysis',
  'Data Management',
  'Research Methods and Data Visualization',
]

interface FundingCallOption {
  id: string
  label: string   // shown in the dropdown
  maxAward: number
}

interface CreateProposalFormProps {
  /** Pre-selected funding call ID (e.g. navigated from Grant Calls page) */
  defaultFundingCallId?: string
  /** Called with the created proposal record on success */
  onSuccess?: (proposal: ProposalRecord) => void
  /** Called when the user clicks Cancel */
  onCancel?: () => void
}

export function CreateProposalForm({
  defaultFundingCallId = '',
  onSuccess,
  onCancel,
}: CreateProposalFormProps) {
  const { currentUserId } = useAuthContext()
  const { createProposal, loading } = useCreateProposal()
  const { toast } = useToast()

  const [fundingCalls, setFundingCalls] = useState<FundingCallOption[]>([])
  const [loadingCalls, setLoadingCalls] = useState(true)

  // Backend response feedback
  const [apiSuccess, setApiSuccess] = useState(false)
  const [apiMessage, setApiMessage] = useState('')
  const [apiErrors, setApiErrors] = useState<string[]>([])

  // Fetch open funding calls for the dropdown
  useEffect(() => {
    const fetch = async () => {
      setLoadingCalls(true)
      try {
        const { data, error } = await supabase
          .from('grant_calls')
          .select('id, title, totalBudget')
          .eq('status', 'Open')
          .order('title')

        if (!error && data) {
          setFundingCalls(
            data.map((gc: { id: string; title: string; totalBudget: number }) => ({
              id: gc.id,
              label: gc.title,
              maxAward: gc.totalBudget,
            }))
          )
        }
      } finally {
        setLoadingCalls(false)
      }
    }
    fetch()
  }, [])

  const formik = useFormik<CreateProposalFormValues>({
    initialValues: {
      title: '',
      abstract: '',
      fundingCallId: defaultFundingCallId,
      requestedAmount: '',
      department: DEPARTMENTS[0],
    },
    validationSchema: createProposalSchema,
    enableReinitialize: false,
    onSubmit: async (values, { resetForm }) => {
      // Clear previous API feedback
      setApiSuccess(false)
      setApiMessage('')
      setApiErrors([])

      const payload = await createProposal({
        title: values.title.trim(),
        abstract: values.abstract.trim(),
        fundingCallId: values.fundingCallId,
        userID: currentUserId || 'anonymous',
        requestedAmount: Number(values.requestedAmount),
        department: values.department,
      })

      if (!payload) {
        // Network / Apollo error — hook already sets `error`
        setApiErrors(['A network error occurred. Please try again.'])
        return
      }

      if (!payload.success) {
        setApiMessage(payload.message)
        setApiErrors(payload.errors ?? [])
        return
      }

      // ── Success path ──────────────────────────────────────────────────
      setApiSuccess(true)
      setApiMessage(payload.message || 'Proposal submitted successfully.')
      toast(`"${payload.proposal?.title}" submitted successfully`, 'success')
      resetForm()

      if (payload.proposal) {
        onSuccess?.(payload.proposal)
      }
    },
  })

  // ── Helpers ───────────────────────────────────────────────────────────────
  const inputCls =
    'w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground focus:border-primary/50 transition-colors disabled:opacity-50'
  const labelCls = 'block text-xs font-semibold text-foreground mb-1.5'
  const errCls = 'text-xs text-red-500 mt-1'

  const isSubmitting = formik.isSubmitting || loading

  // Character count for abstract
  const abstractLen = formik.values.abstract.length

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">

      {/* ── Success banner ────────────────────────────────────────────────── */}
      {apiSuccess && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[13px]">
          <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Proposal submitted!</p>
            <p className="text-[12px] mt-0.5 text-green-600">{apiMessage}</p>
          </div>
        </div>
      )}

      {/* ── API error banner ──────────────────────────────────────────────── */}
      {!apiSuccess && (apiMessage || apiErrors.length > 0) && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            {apiMessage && <p className="font-semibold">{apiMessage}</p>}
            {apiErrors.length > 0 && (
              <ul className="list-disc list-inside text-[12px] mt-1 space-y-0.5">
                {apiErrors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => { setApiMessage(''); setApiErrors([]) }}
            className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Funding Call select ────────────────────────────────────────────── */}
      <div>
        <label className={labelCls}>
          Funding Call
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        {loadingCalls ? (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted border border-border text-[13px] text-muted-foreground">
            <Loader2 size={13} className="animate-spin" />
            Loading funding calls…
          </div>
        ) : (
          <select
            name="fundingCallId"
            value={formik.values.fundingCallId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isSubmitting}
            className={inputCls}
          >
            <option value="">— Select a funding call —</option>
            {fundingCalls.map((fc) => (
              <option key={fc.id} value={fc.id}>
                {fc.label}
              </option>
            ))}
          </select>
        )}
        {formik.touched.fundingCallId && formik.errors.fundingCallId && (
          <p className={errCls}>{formik.errors.fundingCallId}</p>
        )}
      </div>

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <div>
        <label className={labelCls}>
          Proposal Title
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isSubmitting}
          placeholder="Full title of your research proposal"
          className={inputCls}
        />
        {formik.touched.title && formik.errors.title && (
          <p className={errCls}>{formik.errors.title}</p>
        )}
      </div>

      {/* ── Abstract ──────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className={`${labelCls} mb-0`}>
            Abstract
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <span className={`text-[11px] ${abstractLen >= 50 ? 'text-green-600' : 'text-muted-foreground'}`}>
            {abstractLen} / 50 min
          </span>
        </div>
        <textarea
          name="abstract"
          rows={5}
          value={formik.values.abstract}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isSubmitting}
          placeholder="Brief summary of your research objectives, methodology, and expected outcomes…"
          className={`${inputCls} resize-none`}
        />
        {formik.touched.abstract && formik.errors.abstract && (
          <p className={errCls}>{formik.errors.abstract}</p>
        )}
      </div>

      {/* ── Amount + Department ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
            Requested Amount (GHS)
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="number"
            name="requestedAmount"
            value={formik.values.requestedAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isSubmitting}
            placeholder="e.g. 150000"
            className={inputCls}
          />
          {formik.touched.requestedAmount && formik.errors.requestedAmount && (
            <p className={errCls}>{formik.errors.requestedAmount as string}</p>
          )}
        </div>

        <div>
          <label className={labelCls}>
            Department
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <select
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isSubmitting}
            className={inputCls}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {formik.touched.department && formik.errors.department && (
            <p className={errCls}>{formik.errors.department}</p>
          )}
        </div>
      </div>

      {/* ── Auto-filled user note ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted border border-border text-[12px] text-muted-foreground">
        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">i</span>
        This proposal will be submitted under your account.
        {!currentUserId && (
          <span className="text-amber-600 font-semibold ml-1">(Session not detected — user ID will be set server-side.)</span>
        )}
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || apiSuccess}
          className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting…
            </>
          ) : apiSuccess ? (
            <>
              <CheckCircle2 size={14} />
              Submitted
            </>
          ) : (
            'Submit Proposal'
          )}
        </button>
      </div>
    </form>
  )
}
