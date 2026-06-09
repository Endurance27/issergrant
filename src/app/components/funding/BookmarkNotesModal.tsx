import { useFormik } from 'formik'
import * as Yup from 'yup'
import { BookmarkCheck, Loader2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { useBookmarkGrantCall } from '../../../hooks/useBookmarkGrantCall'
import { useAuthContext } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import type { LocalBookmark } from '../../../types/bookmark.types'

interface Props {
  open: boolean
  fundingCallId: string
  fundingCallTitle: string
  initialNotes?: string
  onClose: () => void
  onSuccess: (bookmark: LocalBookmark) => void
}

const schema = Yup.object({
  notes: Yup.string().max(500, 'Notes cannot exceed 500 characters'),
})

export function BookmarkNotesModal({
  open,
  fundingCallId,
  fundingCallTitle,
  initialNotes = '',
  onClose,
  onSuccess,
}: Props) {
  const { currentUserId } = useAuthContext()
  const { bookmarkGrantCall, loading } = useBookmarkGrantCall()
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: { notes: initialNotes },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const payload = await bookmarkGrantCall({
        fundingCallId,
        userID: currentUserId || 'anonymous',
        notes: values.notes.trim() || null,
      })

      if (!payload || !payload.success) {
        toast(payload?.message ?? 'Failed to bookmark', 'error')
        return
      }

      const bookmark: LocalBookmark = {
        fundingCallId,
        fundingCallTitle,
        notes: values.notes.trim(),
        bookmarkedAt: payload.bookmark?.bookmarkedAt ?? new Date().toISOString(),
      }

      toast(`"${fundingCallTitle}" bookmarked`, 'success')
      resetForm()
      onSuccess(bookmark)
      onClose()
    },
  })

  return (
    <Modal open={open} onClose={onClose} title="Bookmark Grant Call" width={480}>
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-[13px] text-amber-800">
          <p className="font-semibold">{fundingCallTitle}</p>
          <p className="text-[12px] mt-0.5 text-amber-600">
            Add optional notes to remember why you bookmarked this call.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Notes <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <span className={`text-[11px] ${formik.values.notes.length > 450 ? 'text-amber-500' : 'text-muted-foreground'}`}>
              {formik.values.notes.length} / 500
            </span>
          </div>
          <textarea
            name="notes"
            rows={4}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="e.g. Relevant to my water sanitation research…"
            className="w-full px-3 py-2.5 rounded-xl outline-none resize-none bg-muted border border-border text-[13px] text-foreground focus:border-primary/50 transition-colors"
          />
          {formik.touched.notes && formik.errors.notes && (
            <p className="text-xs text-red-500 mt-1">{formik.errors.notes}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading || formik.isSubmitting}
            className="flex-1 py-2.5 rounded-xl border border-border font-semibold text-[13px] text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formik.isSubmitting}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold text-[13px] shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, var(--primary), #2D6EA8)' }}
          >
            {loading || formik.isSubmitting ? (
              <><Loader2 size={14} className="animate-spin" /> Saving…</>
            ) : (
              <><BookmarkCheck size={14} /> Save Bookmark</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
