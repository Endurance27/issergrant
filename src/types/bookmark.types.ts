/** The shape returned inside the bookmarkGrantCall response */
export interface BookmarkedGrantCall {
  id: string
  title: string
  description: string
  category: string
  totalBudget: number
  deadline: string
  eligibility: string
  status: string
  applicationCount: number
  isBookmarked: boolean
  bookmarkNotes?: string | null
}

export interface Bookmark {
  id: string
  userID: string
  fundingCallId: string
  fundingCallTitle: string
  notes?: string | null
  bookmarkedAt: string
}

export interface BookmarkGrantCallPayload {
  success: boolean
  message: string
  grantCall?: BookmarkedGrantCall | null
  bookmark?: Bookmark | null
}

export interface BookmarkGrantCallResponse {
  bookmarkGrantCall: BookmarkGrantCallPayload
}

export interface BookmarkGrantCallVariables {
  fundingCallId: string
  userID: string
  notes?: string | null
}

/** Lightweight client-side bookmark record kept in local state */
export interface LocalBookmark {
  fundingCallId: string
  fundingCallTitle: string
  notes: string
  bookmarkedAt: string
}
