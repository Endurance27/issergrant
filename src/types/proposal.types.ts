// Backend: createProposal(input: CreateProposalInput!): ProposalPayload!
export interface CreateProposalInput {
  title: string
  abstract: string
  fundingCallId: string
  requestedAmount: number
  userID: string
  /** Zero or more Co-Principal Investigators — a proposal is no longer limited to one Co-PI. */
  coPiIds?: string[]
}

// Backend: updateProposal(id: String!, input: UpdateProposalInput!): ProposalPayload!
export interface UpdateProposalInput {
  title?: string
  abstract?: string
  requestedAmount?: number
}

export interface ProposalPI {
  id: string; name: string; email: string; department: string
}

export interface ProposalCollaborator {
  id: string; guestId: string; proposalId: string
  roleDescription: string
  guest: { id: string; name: string; email: string; department: string }
}

export interface ProposalReview {
  id: string
  proposalId: string
  director: { id: string; name: string; email: string }
  decision: 'approved' | 'rejected' | 'revised'
  comment: string
  createdAt: string
  updatedAt: string
}

export interface ProposalReviewEntry {
  action: string
  comment: string
  reviewer: string
  reviewerRole: string
  date: string
}

export interface ProposalFundingCall {
  id: string
  funder: string
  totalAvailable: number
  maximumAward: number
  theme: string
  description: string
  hasMinMaxAward: boolean
  minimumAward?: number
  allowsMultipleApplications: string
  openDate: string
  originalCallLink: string
  eligibility: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ProposalRecord {
  id: string
  title: string
  abstract: string
  fundingCall?: ProposalFundingCall
  status: string
  requestedAmount: number
  /** ISO date-time string set once the proposal is submitted — null/undefined while still a draft. */
  submittedAt?: string | null
  createdAt?: string
  updatedAt?: string
  /** The Principal Investigator — the researcher who created the proposal. */
  user?: ProposalPI
  /** Zero or more Co-Principal Investigators. */
  coPIs?: ProposalPI[]
  collaborators?: ProposalCollaborator[]
  /** Director reviews recorded against this proposal. */
  reviews?: ProposalReview[]
  /** Full audit trail of status transitions. */
  reviewHistory?: ProposalReviewEntry[]
}

// Backend: proposalsByResearcher(researcherId: ID!, limit?, offset?, status?): ProposalConnection!
export interface ProposalEdge {
  cursor: string
  node: ProposalRecord
}

export interface ProposalPageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string | null
  endCursor?: string | null
  currentPage?: number | null
  totalPages?: number | null
}

export interface ProposalConnection {
  edges: ProposalEdge[]
  pageInfo: ProposalPageInfo
  totalCount: number
}

export interface CreateProposalPayload {
  success: boolean
  message: string
  errors?: string[] | null
  proposal?: ProposalRecord | null
}

export interface CreateProposalResponse {
  createProposal: CreateProposalPayload
}

export interface UpdateProposalPayload {
  success: boolean
  message: string
  errors?: string[] | null
  proposal?: ProposalRecord | null
}

export interface UpdateProposalResponse {
  updateProposal: UpdateProposalPayload
}

export interface RemoveProposalCoPiResponse {
  removeProposalCoPi: UpdateProposalPayload
}

/** Formik form values for the create-proposal form */
export interface CreateProposalFormValues {
  title: string
  abstract: string
  fundingCallId: string
  requestedAmount: number | ''
  /** Zero or more selected Co-PI researcher ids. */
  coPiIds: string[]
}

/** Formik form values for the edit-proposal form */
export interface EditProposalFormValues {
  title: string
  abstract: string
  requestedAmount: number | ''
}

// Backend: myCoPiProposals(limit?, offset?, search?, status?): ProposalConnection!
export interface GetCoPiProposalsResponse {
  myCoPiProposals: ProposalConnection
}

export interface GetCoPiProposalsVariables {
  limit?: number
  offset?: number
  search?: string
  status?: string
}

// Backend: saveProposalDraft(input: SaveProposalDraftInput!): ProposalPayload!
// Omit `id` to create a new draft; supply it to update an existing one in
// place. fundingCallId is always required; any other field left out of the
// input is simply left untouched, so a draft can be saved incrementally.
export interface SaveProposalDraftInput {
  id?: string
  title?: string
  abstract?: string
  fundingCallId: string
  requestedAmount?: number
  /** Omit to leave the current set of Co-PIs unchanged; pass [] to clear it. */
  coPiIds?: string[]
}

/** GraphQL payload returned by the draft-save/submit mutations. */
export interface DraftProposalPayload {
  success: boolean
  message: string
  errors?: string[] | null
  proposal?: ProposalRecord | null
}

/** Formik form values for the draft-first proposal form */
export interface DraftProposalFormValues {
  fundingCallId: string
  title: string
  abstract: string
  requestedAmount: number | ''
  /** Zero or more selected Co-PI researcher ids. */
  coPiIds: string[]
}

// Backend: myProposalDrafts(search?, limit?, offset?): ProposalConnection!
export interface GetMyProposalDraftsResponse {
  myProposalDrafts: ProposalConnection
}

export interface GetMyProposalDraftsVariables {
  search?: string
  limit?: number
  offset?: number
}

// Backend: proposals(search?, status?, limit?, offset?): ProposalConnection!
// Org-wide listing (not scoped to a single researcher) — used by Director/Admin views.
export interface GetAllProposalsResponse {
  proposals: ProposalConnection
}

export interface GetAllProposalsVariables {
  search?: string
  status?: string
  limit?: number
  offset?: number
}
