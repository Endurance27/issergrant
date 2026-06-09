import { useState } from 'react'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { useBookmarkGrantCall } from '../../../hooks/useBookmarkGrantCall'
import { useAuthContext } from '../../context/AuthContext'
import { useToast } from '../ui/Toast'
import type { LocalBookmark } from '../../../types/bookmark.types'

interface BookmarkButtonProps {
  fundingCallId: string
  fundingCallTitle: string
  isBookmarked: boolean
  notes?: string
  /** Called after a successful toggle so the parent can update its state */
  onToggle: (bookmarked: boolean, bookmark: LocalBookmark | null) => void
  /** Visual size variant */
  size?: 'sm' | 'md'
}

export function BookmarkButton({
  fundingCallId,
  fundingCallTitle,
  isBookmarked,
  notes = '',
  onToggle,
  size = 'md',
}: BookmarkButtonProps) {
  const { currentUserId } = useAuthContext()
  const { bookmarkGrantCall, loading } = useBookmarkGrantCall()
  const { toast } = useToast()

  // Local optimistic state — flips immediately; rolls back on failure
  const [optimistic, setOptimistic] = useState(isBookmarked)

  const iconSize = size === 'sm' ? 14 : 16
  const btnCls =
    size === 'sm'
      ? 'p-1.5 rounded-lg transition-all'
      : 'p-2 rounded-xl transition-all'

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // don't open detail modal

    if (!currentUserId) {
      toast('Please log in to bookmark grant calls', 'warning')
      return
    }

    // Optimistic flip
    const next = !optimistic
    setOptimistic(next)

    const payload = await bookmarkGrantCall({
      fundingCallId,
      userID: currentUserId,
      notes: notes || null,
    })

    if (!payload || !payload.success) {
      // Roll back
      setOptimistic(!next)
      toast(payload?.message ?? 'Failed to update bookmark', 'error')
      return
    }

    const localBookmark: LocalBookmark | null = payload.bookmark
      ? {
          fundingCallId: payload.bookmark.fundingCallId,
          fundingCallTitle: payload.bookmark.fundingCallTitle,
          notes: payload.bookmark.notes ?? '',
          bookmarkedAt: payload.bookmark.bookmarkedAt,
        }
      : null

    onToggle(next, next ? localBookmark : null)
    toast(
      next
        ? `"${fundingCallTitle}" bookmarked`
        : `Bookmark removed`,
      next ? 'success' : 'info'
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      title={optimistic ? 'Remove bookmark' : 'Bookmark this call'}
      className={`${btnCls} ${
        optimistic
          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
          : 'text-muted-foreground hover:text-amber-500 hover:bg-amber-50'
      } disabled:opacity-40`}
    >
      {loading ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : optimistic ? (
        <BookmarkCheck size={iconSize} />
      ) : (
        <Bookmark size={iconSize} />
      )}
    </button>
  )
}
