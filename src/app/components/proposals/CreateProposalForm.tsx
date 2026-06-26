import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import {
  Loader2, X, CheckCircle2, AlertCircle, Save, Send, Edit3
} from 'lucide-react'
import { draftProposalSchema } from '../../../schemas/proposal.schema'
import { useSaveDraft, useUpdateDraft, useSubmitProposal } from '../../../hooks/useDraftProposals'
import { useAuthStore } from '../../../store/auth.store'
import { useToast } from '../ui/Toast'
import { supabase } from '../../../lib/supabase'
import type { DraftProposalFormValues, ProposalRecord } from '../../../types/proposal.types'

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
  label: string
  maxAward: number
}

interface ResearcherOption {
  id: string
  name: string
  department: string
}

interface CreateProposalFormProps {
  /** Pre-selected funding call ID (e.g. navigated from Grant Calls page) */
  defaultFundingCallId?: string
  /** Existing draft proposal to edit */
  existingProposal?: ProposalRecord
  /** Called with the saved/submitted proposal record on success */
  onSuccess?: (proposal: ProposalRecord) => void
  /** Called when the user clicks Cancel */
  onCancel?: () => void
}

type AutoSaveStatus = 'idle' | 'saving' | 'saved'

function computeProgress(values: DraftProposalFormValues): number {
  const fields: (keyof DraftProposalFormValues)[] = [
    'fundingCallId', 'title', 'abstract', 'requestedAmount', 'department',
  ]
  const filled = fields.filter(f => {
    const v = values[f]
    return v !== '' && v !== undefined && v !== null
  }).length
  return Math.round((filled / fields.length) * 100)
}

export function CreateProposalForm({
  defaultFundingCallId = '',
  existingProposal,
  onSuccess,
  onCancel,
}: CreateProposalFormProps) {
  const currentUserId = useAuthStore((s) => s.user?.id ?? '')
  const { saveDraft, loading: savingDraft } = useSaveDraft()
  const { updateDraft, loading: updatingDraft } = useUpdateDraft()
  const { submitProposal, loading: submitting } = useSubmitProposal()
  const { toast } = useToast()

  const [fundingCalls, setFundingCalls] = useState<FundingCallOption[]>([])
  const [loadingCalls, setLoadingCalls] = useState(true)
  const [researchers, setResearchers] = useState<ResearcherOption[]>([])

  // The proposal ID once it's been saved (either from existingProposal or after first save)
  const [proposalId, setProposalId] = useState<string | null>(existingProposal?.id ?? null)

  // Backend response feedback
  const [apiSuccess, setApiSuccess] = useState(false)
  const [apiMessage, setApiMessage] = useState('')
  const [apiErrors, setApiErrors] = useState<string[]>([])

  // Auto-save
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle')
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

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

  // Fetch researchers for Co-PI dropdown
  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, department')
          .eq('role', 'researcher')
          .order('name')

        if (!error && data) {
          setResearchers(data as ResearcherOption[])
        }
      } catch {
        // Silently fail — Co-PI dropdown will just be empty
      }
    }
    fetchResearchers()
  }, [])

  const formik = useFormik<DraftProposalFormValues>({
    enableReinitialize: true,
    initialValues: {
      fundingCallId: existingProposal?.fundingCallId ?? defaultFundingCallId,
      title: existingProposal?.title ?? '',
      abstract: existingProposal?.abstract ?? '',
      requestedAmount: existingProposal?.requestedAmount ?? '',
      department: existingProposal?.department ?? DEPARTMENTS[0],
      coPrincipalInvestigatorId: existingProposal?.coPrincipalInvestigator?.id ?? '',
    },
    validationSchema: draftProposalSchema,
    onSubmit: () => {
      // handled by explicit button actions
    },
  })

  // Auto-save: debounce 45 seconds after last change
  useEffect(() => {
    if (formik.dirty) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = setTimeout(async () => {
        setAutoSaveStatus('saving')
        const values = formik.values
        if (proposalId) {
          await updateDraft(proposalId, buildUpdateInput(values))
        } else if (values.fundingCallId) {
          const payload = await saveDraft(buildSaveInput(values))
          if (payload?.proposal?.id) setProposalId(payload.proposal.id)
        }
        setAutoSaveStatus('saved')
        setTimeout(() => setAutoSaveStatus('idle'), 3000)
      }, 45_000)
    }
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values, formik.dirty])

  // ── Helpers ───────────────────────────────────────────────────────────────
  function buildSaveInput(values: DraftProposalFormValues) {
    return {
      fundingCallId: values.fundingCallId,
      ...(values.title ? { title: values.title.trim() } : {}),
      ...(values.abstract ? { abstract: values.abstract.trim() } : {}),
      ...(values.requestedAmount !== '' ? { requestedAmount: Number(values.requestedAmount) } : {}),
      ...(values.department ? { department: values.department } : {}),
      ...(values.coPrincipalInvestigatorId ? { coPrincipalInvestigatorId: values.coPrincipalInvestigatorId } : {}),
    }
  }

  function buildUpdateInput(values: DraftProposalFormValues) {
    return {
      ...(values.fundingCallId ? { fundingCallId: values.fundingCallId } : {}),
      ...(values.title ? { title: values.title.trim() } : {}),
      ...(values.abstract ? { abstract: values.abstract.trim() } : {}),
      ...(values.requestedAmount !== '' ? { requestedAmount: Number(values.requestedAmount) } : {}),
      ...(values.department ? { department: values.department } : {}),
      ...(values.coPrincipalInvestigatorId ? { coPrincipalInvestigatorId: values.coPrincipalInvestigatorId } : {}),
    }
  }

  const clearFeedback = () => {
    setApiSuccess(false)
    setApiMessage('')
    setApiErrors([])
  }

  const handleSaveDraft = async () => {
    const errors = await formik.validateForm()
    if (errors.fundingCallId) {
      formik.setFieldTouched('fundingCallId', true)
      return
    }
    clearFeedback()

    let payload
    if (proposalId) {
      payload = await updateDraft(proposalId, buildUpdateInput(formik.values))
    } else {
      payload = await saveDraft(buildSaveInput(formik.values))
    }

    if (!payload) {
      setApiErrors(['A network error occurred. Please try again.'])
      return
    }

    if (!payload.success) {
      setApiMessage(payload.message)
      setApiErrors(payload.errors ?? [])
      return
    }

    if (payload.proposal?.id) setProposalId(payload.proposal.id)
    setApiSuccess(true)
    setApiMessage(payload.message || 'Draft saved successfully.')
    toast('Draft saved', 'success')

    if (payload.proposal) {
      onSuccess?.(payload.proposal)
    }
  }

  const handleSubmitProposal = async () => {
    if (!canSubmit) return
    clearFeedback()

    // Ensure we have a saved draft first
    let id = proposalId
    if (!id) {
      const savePayload = await saveDraft(buildSaveInput(formik.values))
      if (!savePayload?.success || !savePayload.proposal?.id) {
        setApiErrors(savePayload?.errors ?? ['Failed to save draft before submitting.'])
        return
      }
      id = savePayload.proposal.id
      setProposalId(id)
    }

    const payload = await submitProposal(id)
    if (!payload) {
      setApiErrors(['A network error occurred. Please try again.'])
      return
    }

    if (!payload.success) {
      setApiMessage(payload.message)
      setApiErrors(payload.errors ?? [])
      return
    }

    setApiSuccess(true)
    setApiMessage(payload.message || 'Proposal submitted successfully.')
    toast(`"${payload.proposal?.title ?? 'Proposal'}" submitted successfully`, 'success')

    if (payload.proposal) {
      onSuccess?.(payload.proposal)
    }
  }

  const handleContinueEditing = () => {
    if (titleInputRef.current) {
      titleInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      titleInputRef.current.focus()
    }
  }

  const inputCls =
    'w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground focus:border-primary/50 transition-colors disabled:opacity-50'
  const labelCls = 'block text-xs font-semibold text-foreground mb-1.5'
  const errCls = 'text-xs text-red-500 mt-1'

  const isAnyLoading = savingDraft || updatingDraft || submitting
  const abstractLen = formik.values.abstract.length
  const copiOptions = researchers.filter(r => r.id !== currentUserId)

  const progress = computeProgress(formik.values)

  // Submit is enabled when all 5 required fields are filled
  const canSubmit =
    Boolean(formik.values.fundingCallId) &&
    Boolean(formik.values.title?.trim()) &&
    (formik.values.abstract?.trim().length ?? 0) >= 50 &&
    formik.values.requestedAmount !== '' &&
    Number(formik.values.requestedAmount) > 0 &&
    Boolean(formik.values.department)

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">

      {/* ── Auto-save status + Progress bar ───────────────────────────────── */}
      <div className="space-y-2">
        {/* Progress bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), #2D6EA8)' }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">{progress}% complete</span>

          {/* Auto-save indicator */}
          {autoSaveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
              <Loader2 size={11} className="animate-spin" /> Saving…
            </span>
          )}
          {autoSaveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-[11px] text-green-600 whitespace-nowrap">
              <CheckCircle2 size={11} /> Saved ✓
            </span>
          )}
        </div>
      </div>

      {/* ── Success banner ─────────────────────────────────────────────────── */}
      {apiSuccess && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-[13px]">
          <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">
              {apiMessage.toLowerCase().includes('submit') ? 'Proposal submitted!' : 'Draft saved!'}
            </p>
            <p className="text-[12px] mt-0.5 text-green-600">{apiMessage}</p>
          </div>
          <button type="button" onClick={clearFeedback} className="ml-auto flex-shrink-0 text-green-500 hover:text-green-700">
            <X size={14} />
          </button>
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
            onClick={clearFeedback}
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
            disabled={isAnyLoading}
            className={inputCls}
          >
            <option value="">— Select a funding call —</option>
            {fundingCalls.map((fc) => (
              <option key={fc.id} value={fc.id}>{fc.label}</option>
            ))}
          </select>
        )}
        {formik.touched.fundingCallId && formik.errors.fundingCallId && (
          <p className={errCls}>{formik.errors.fundingCallId}</p>
        )}
      </div>

      {/* ── Title ─────────────────────────────────────────────────────────── */}
      <div>
        <label className={labelCls}>Proposal Title</label>
        <input
          ref={titleInputRef}
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isAnyLoading}
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
          <label className={`${labelCls} mb-0`}>Abstract</label>
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
          disabled={isAnyLoading}
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
          <label className={labelCls}>Requested Amount (GHS)</label>
          <input
            type="number"
            name="requestedAmount"
            value={formik.values.requestedAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isAnyLoading}
            placeholder="e.g. 150000"
            className={inputCls}
          />
          {formik.touched.requestedAmount && formik.errors.requestedAmount && (
            <p className={errCls}>{formik.errors.requestedAmount as string}</p>
          )}
        </div>

        <div>
          <label className={labelCls}>Department</label>
          <select
            name="department"
            value={formik.values.department}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isAnyLoading}
            className={inputCls}
          >
            <option value="">— Select department —</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {formik.touched.department && formik.errors.department && (
            <p className={errCls}>{formik.errors.department}</p>
          )}
        </div>
      </div>

      {/* ── Co-Principal Investigator ──────────────────────────────────────── */}
      <div>
        <label className={labelCls}>
          Co-Principal Investigator{' '}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <select
          name="coPrincipalInvestigatorId"
          value={formik.values.coPrincipalInvestigatorId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isAnyLoading}
          className={inputCls}
        >
          <option value="">— No Co-PI —</option>
          {copiOptions.map(r => (
            <option key={r.id} value={r.id}>{r.name} — {r.department}</option>
          ))}
        </select>
      </div>

      {/* ── Auto-filled user note ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted border border-border text-[12px] text-muted-foreground">
        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">i</span>
        This proposal will be submitted under your account as Principal Investigator.
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isAnyLoading}
              className="px-4 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          {/* Continue Editing — shown when existingProposal is provided and form is pristine */}
          {existingProposal && !formik.dirty && (
            <button
              type="button"
              onClick={handleContinueEditing}
              disabled={isAnyLoading}
              className="flex-1 py-2.5 rounded-xl border border-primary/40 text-primary font-semibold text-[13px] hover:bg-primary/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Edit3 size={14} />
              Continue Editing
            </button>
          )}

          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isAnyLoading}
            className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {savingDraft || updatingDraft ? (
              <><Loader2 size={14} className="animate-spin" /> Saving…</>
            ) : (
              <><Save size={14} /> Save Draft</>
            )}
          </button>
        </div>

        {/* Submit Proposal */}
        <button
          type="button"
          onClick={handleSubmitProposal}
          disabled={isAnyLoading || !canSubmit}
          title={!canSubmit ? 'Fill in all required fields to submit' : undefined}
          className="w-full py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}
        >
          {submitting ? (
            <><Loader2 size={14} className="animate-spin" /> Submitting…</>
          ) : (
            <><Send size={14} /> Submit Proposal</>
          )}
        </button>

        {!canSubmit && (
          <p className="text-[11px] text-muted-foreground text-center">
            Complete all fields (title, abstract ≥50 chars, amount, department) to submit.
          </p>
        )}
      </div>
    </form>
  )
}
