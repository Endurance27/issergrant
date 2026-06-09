import { useFormik } from 'formik'
import { createFundingCallSchema } from '../../../schemas/fundingCall.schema'
import type { CreateFundingCallFormValues } from '../../../types/fundingCall.types'
import { Plus, Trash2, X } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: CreateFundingCallFormValues) => Promise<void>
  isSubmitting: boolean
  formError: string
}

export function CreateFundingCallModal({ open, onClose, onSubmit, isSubmitting, formError }: Props) {
  const formik = useFormik<CreateFundingCallFormValues>({
    initialValues: {
      funder: '',
      totalAvailable: '',
      maximumAward: '',
      theme: '',
      description: '',
      hasMinMaxAward: false,
      minimumAward: '',
      allowsMultipleApplications: 'no',
      openDate: '',
      originalCallLink: '',
      eligibility: [''],
    },
    validationSchema: createFundingCallSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values)
      resetForm()
    },
  })

  const addEligibility = () => {
    formik.setFieldValue('eligibility', [...formik.values.eligibility, ''])
  }

  const removeEligibility = (index: number) => {
    const updated = formik.values.eligibility.filter((_, i) => i !== index)
    formik.setFieldValue('eligibility', updated.length > 0 ? updated : [''])
  }

  const updateEligibility = (index: number, value: string) => {
    const updated = [...formik.values.eligibility]
    updated[index] = value
    formik.setFieldValue('eligibility', updated)
  }

  const handleClose = () => {
    formik.resetForm()
    onClose()
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl outline-none bg-muted border border-border text-[13px] text-foreground focus:border-primary/50 transition-colors'
  const labelCls = 'block text-xs font-semibold text-foreground mb-1.5'
  const errorCls = 'text-xs text-red-500 mt-1'

  return (
    <Modal open={open} onClose={handleClose} title="Create Funding Call" width={660}>
      <form onSubmit={formik.handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

        {/* Funder */}
        <div>
          <label className={labelCls}>Funder / Organisation</label>
          <input
            name="funder"
            value={formik.values.funder}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. World Bank, USAID"
            className={inputCls}
          />
          {formik.touched.funder && formik.errors.funder && (
            <p className={errorCls}>{formik.errors.funder}</p>
          )}
        </div>

        {/* Theme */}
        <div>
          <label className={labelCls}>Theme / Focus Area</label>
          <input
            name="theme"
            value={formik.values.theme}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. Climate Change & Sustainable Development"
            className={inputCls}
          />
          {formik.touched.theme && formik.errors.theme && (
            <p className={errorCls}>{formik.errors.theme}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Describe the funding call objectives and scope..."
            className={`${inputCls} resize-none`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className={errorCls}>{formik.errors.description}</p>
          )}
        </div>

        {/* Financial grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Total Available (GHS)</label>
            <input
              type="number"
              name="totalAvailable"
              value={formik.values.totalAvailable}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. 5000000"
              className={inputCls}
            />
            {formik.touched.totalAvailable && formik.errors.totalAvailable && (
              <p className={errorCls}>{formik.errors.totalAvailable as string}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>Maximum Award (GHS)</label>
            <input
              type="number"
              name="maximumAward"
              value={formik.values.maximumAward}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. 200000"
              className={inputCls}
            />
            {formik.touched.maximumAward && formik.errors.maximumAward && (
              <p className={errorCls}>{formik.errors.maximumAward as string}</p>
            )}
          </div>
        </div>

        {/* Has Min/Max Award toggle */}
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

        {/* Minimum Award — conditional */}
        {formik.values.hasMinMaxAward && (
          <div>
            <label className={labelCls}>Minimum Award (GHS)</label>
            <input
              type="number"
              name="minimumAward"
              value={formik.values.minimumAward}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. 50000"
              className={inputCls}
            />
            {formik.touched.minimumAward && formik.errors.minimumAward && (
              <p className={errorCls}>{formik.errors.minimumAward as string}</p>
            )}
          </div>
        )}

        {/* Dates grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Open Date</label>
            <input
              type="date"
              name="openDate"
              value={formik.values.openDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputCls}
            />
            {formik.touched.openDate && formik.errors.openDate && (
              <p className={errorCls}>{formik.errors.openDate}</p>
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
              <p className={errorCls}>{formik.errors.allowsMultipleApplications}</p>
            )}
          </div>
        </div>

        {/* Original Call Link */}
        <div>
          <label className={labelCls}>Original Call Link</label>
          <input
            name="originalCallLink"
            value={formik.values.originalCallLink}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="https://funder.org/calls/2026"
            className={inputCls}
          />
          {formik.touched.originalCallLink && formik.errors.originalCallLink && (
            <p className={errorCls}>{formik.errors.originalCallLink}</p>
          )}
        </div>

        {/* Eligibility — dynamic list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={labelCls + ' mb-0'}>Eligibility Criteria</label>
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
                  onChange={e => updateEligibility(idx, e.target.value)}
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
            <p className={errorCls}>{formik.errors.eligibility}</p>
          )}
        </div>

        {/* Form error */}
        {formError && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px]">
            <X size={14} className="flex-shrink-0" />
            {formError}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 sticky bottom-0 bg-card pb-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || formik.isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}
          >
            {isSubmitting || formik.isSubmitting ? 'Creating...' : 'Create Funding Call'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
