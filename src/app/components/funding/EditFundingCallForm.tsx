import { useEffect } from 'react'
import { useFormik } from 'formik'
import { Plus, Trash2, X, Loader2 } from 'lucide-react'
import { updateFundingCallSchema } from '../../../schemas/updateFundingCall.schema'
import { useUpdateFundingCall } from '../../../hooks/useUpdateFundingCall'
import { useToast } from '../ui/Toast'
import type { FundingCall } from '../../../types/fundingCall.types'
import type {
  EditFundingCallFormValues,
  UpdateFundingCallInput,
} from '../../../types/updateFundingCall.types'

interface EditFundingCallFormProps {
  /** The funding call to edit */
  fundingCall: FundingCall
  /** Called with the updated record after a successful mutation */
  onSuccess: (updated: FundingCall) => void
  /** Called when the user cancels without saving */
  onCancel: () => void
}

export function EditFundingCallForm({
  fundingCall,
  onSuccess,
  onCancel,
}: EditFundingCallFormProps) {
  const { updateFundingCall, loading, error } = useUpdateFundingCall()
  const { toast } = useToast()

  const formik = useFormik<EditFundingCallFormValues>({
    initialValues: {
      id: fundingCall.id,
      funder: fundingCall.funder ?? '',
      totalAvailable: fundingCall.totalAvailable ?? 0,
      maximumAward: fundingCall.maximumAward ?? 0,
      theme: fundingCall.theme ?? '',
      description: fundingCall.description ?? '',
      hasMinMaxAward: fundingCall.hasMinMaxAward ?? false,
      minimumAward: fundingCall.minimumAward ?? 0,
      allowsMultipleApplications: fundingCall.allowsMultipleApplications ?? 'no',
      openDate: fundingCall.openDate ?? '',
      originalCallLink: fundingCall.originalCallLink ?? '',
      eligibility:
        fundingCall.eligibility && fundingCall.eligibility.length > 0
          ? fundingCall.eligibility
          : [''],
    },
    validationSchema: updateFundingCallSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Build a true partial-patch payload — only include fields that
      // differ from the original funding call so we avoid unnecessary writes.
      const patch: UpdateFundingCallInput = { id: values.id }

      if (values.funder !== (fundingCall.funder ?? '')) patch.funder = values.funder
      if (values.totalAvailable !== (fundingCall.totalAvailable ?? 0))
        patch.totalAvailable = Number(values.totalAvailable)
      if (values.maximumAward !== (fundingCall.maximumAward ?? 0))
        patch.maximumAward = Number(values.maximumAward)
      if (values.theme !== (fundingCall.theme ?? '')) patch.theme = values.theme
      if (values.description !== (fundingCall.description ?? ''))
        patch.description = values.description
      if (values.hasMinMaxAward !== (fundingCall.hasMinMaxAward ?? false))
        patch.hasMinMaxAward = values.hasMinMaxAward
      if (values.allowsMultipleApplications !== (fundingCall.allowsMultipleApplications ?? 'no'))
        patch.allowsMultipleApplications = values.allowsMultipleApplications
      if (values.openDate !== (fundingCall.openDate ?? '')) patch.openDate = values.openDate
      if (values.originalCallLink !== (fundingCall.originalCallLink ?? ''))
        patch.originalCallLink = values.originalCallLink

      // Eligibility: compare serialized form to detect change
      const cleanEligibility = values.eligibility.filter((e) => e.trim() !== '')
      const originalEligibility = fundingCall.eligibility ?? []
      if (JSON.stringify(cleanEligibility) !== JSON.stringify(originalEligibility))
        patch.eligibility = cleanEligibility

      // Minimum award — only include when hasMinMaxAward is true; send null to clear
      if (values.hasMinMaxAward) {
        const minVal = Number(values.minimumAward)
        if (minVal !== (fundingCall.minimumAward ?? 0)) patch.minimumAward = minVal
      } else {
        // User disabled min/max — explicitly clear the field on the server
        if (fundingCall.hasMinMaxAward) patch.minimumAward = null
      }

      // If nothing changed, skip the network call
      if (Object.keys(patch).length === 1) {
        toast('No changes to save', 'warning')
        return
      }

      const result = await updateFundingCall(patch)
      if (!result) return // hook already captures error

      toast('Funding call updated successfully', 'success')

      // Merge updated fields back into the local FundingCall shape for the UI
      const merged: FundingCall = {
        ...fundingCall,
        funder: result.funder,
        totalAvailable: result.totalAvailable,
        maximumAward: result.maximumAward,
        minimumAward: result.minimumAward ?? undefined,
        hasMinMaxAward: result.hasMinMaxAward,
        theme: result.theme,
        description: result.description,
        allowsMultipleApplications: result.allowsMultipleApplications,
        openDate: result.openDate,
        originalCallLink: result.originalCallLink,
        eligibility: result.eligibility,
      }
      onSuccess(merged)
    },
  })

  // When hasMinMaxAward is toggled off reset the field value so validation passes
  useEffect(() => {
    if (!formik.values.hasMinMaxAward) {
      formik.setFieldValue('minimumAward', 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.hasMinMaxAward])

  // ── helpers ──────────────────────────────────────────────────────────────
  const addEligibility = () =>
    formik.setFieldValue('eligibility', [...formik.values.eligibility, ''])

  const removeEligibility = (idx: number) => {
    const next = formik.values.eligibility.filter((_, i) => i !== idx)
    formik.setFieldValue('eligibility', next.length > 0 ? next : [''])
  }

  const updateEligibilityItem = (idx: number, value: string) => {
    const next = [...formik.values.eligibility]
    next[idx] = value
    formik.setFieldValue('eligibility', next)
  }

  // ── styles ────────────────────────────────────────────────────────────────
  const inputCls =
    'w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground focus:border-primary/50 transition-colors'
  const labelCls = 'block text-xs font-semibold text-foreground mb-1.5'
  const errCls = 'text-xs text-red-500 mt-1'

  const field = <K extends keyof EditFundingCallFormValues>(name: K) => ({
    name,
    value: formik.values[name] as string | number,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
  })

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
      {/* ── Funder ─────────────────────────────────────────────────────── */}
      <div>
        <label className={labelCls}>Funder / Organisation</label>
        <input {...field('funder')} placeholder="e.g. World Bank" className={inputCls} />
        {formik.touched.funder && formik.errors.funder && (
          <p className={errCls}>{formik.errors.funder}</p>
        )}
      </div>

      {/* ── Theme ──────────────────────────────────────────────────────── */}
      <div>
        <label className={labelCls}>Theme / Focus Area</label>
        <input {...field('theme')} placeholder="e.g. Climate Change" className={inputCls} />
        {formik.touched.theme && formik.errors.theme && (
          <p className={errCls}>{formik.errors.theme}</p>
        )}
      </div>

      {/* ── Description ────────────────────────────────────────────────── */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          name="description"
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`${inputCls} resize-none`}
          placeholder="Describe the funding call objectives…"
        />
        {formik.touched.description && formik.errors.description && (
          <p className={errCls}>{formik.errors.description}</p>
        )}
      </div>

      {/* ── Financial row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Total Available (GHS)</label>
          <input type="number" {...field('totalAvailable')} placeholder="5000000" className={inputCls} />
          {formik.touched.totalAvailable && formik.errors.totalAvailable && (
            <p className={errCls}>{formik.errors.totalAvailable as string}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>Maximum Award (GHS)</label>
          <input type="number" {...field('maximumAward')} placeholder="200000" className={inputCls} />
          {formik.touched.maximumAward && formik.errors.maximumAward && (
            <p className={errCls}>{formik.errors.maximumAward as string}</p>
          )}
        </div>
      </div>

      {/* ── Min/Max toggle ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="hasMinMaxAward"
            checked={formik.values.hasMinMaxAward}
            onChange={formik.handleChange}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
        </label>
        <span className="text-[13px] font-medium text-foreground">Enable minimum award amount</span>
      </div>

      {/* ── Minimum award (conditional) ────────────────────────────────── */}
      {formik.values.hasMinMaxAward && (
        <div>
          <label className={labelCls}>Minimum Award (GHS)</label>
          <input type="number" {...field('minimumAward')} placeholder="50000" className={inputCls} />
          {formik.touched.minimumAward && formik.errors.minimumAward && (
            <p className={errCls}>{formik.errors.minimumAward as string}</p>
          )}
        </div>
      )}

      {/* ── Date + Multiple Applications ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Open Date</label>
          <input type="date" {...field('openDate')} className={inputCls} />
          {formik.touched.openDate && formik.errors.openDate && (
            <p className={errCls}>{formik.errors.openDate}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>Allows Multiple Applications</label>
          <select
            name="allowsMultipleApplications"
            value={formik.values.allowsMultipleApplications}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputCls}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {formik.touched.allowsMultipleApplications && formik.errors.allowsMultipleApplications && (
            <p className={errCls}>{formik.errors.allowsMultipleApplications as string}</p>
          )}
        </div>
      </div>

      {/* ── Original Call Link ─────────────────────────────────────────── */}
      <div>
        <label className={labelCls}>Original Call Link</label>
        <input
          {...field('originalCallLink')}
          placeholder="https://funder.org/calls/2026"
          className={inputCls}
        />
        {formik.touched.originalCallLink && formik.errors.originalCallLink && (
          <p className={errCls}>{formik.errors.originalCallLink}</p>
        )}
      </div>

      {/* ── Eligibility Criteria (dynamic) ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={`${labelCls} mb-0`}>Eligibility Criteria</label>
          <button
            type="button"
            onClick={addEligibility}
            className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
          >
            <Plus size={13} /> Add criterion
          </button>
        </div>
        <div className="space-y-2">
          {formik.values.eligibility.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={item}
                onChange={(e) => updateEligibilityItem(idx, e.target.value)}
                onBlur={() => formik.setFieldTouched(`eligibility[${idx}]`, true)}
                placeholder={`Criterion ${idx + 1}`}
                className={inputCls}
              />
              {formik.values.eligibility.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEligibility(idx)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {formik.touched.eligibility && typeof formik.errors.eligibility === 'string' && (
          <p className={errCls}>{formik.errors.eligibility}</p>
        )}
      </div>

      {/* ── Mutation / network error ────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
          <X size={14} className="flex-shrink-0" />
          {error.message || 'Failed to update funding call. Please try again.'}
        </div>
      )}

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div className="flex gap-3 pt-2 sticky bottom-0 bg-card pb-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || formik.isSubmitting}
          className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || formik.isSubmitting}
          className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}
        >
          {(loading || formik.isSubmitting) ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  )
}
