// Backend: createProposal(input: CreateProposalInput!): ProposalPayload!
export interface CreateProposalInput {
  title: string
  abstract: string
  fundingCallId: string
  requestedAmount: number
  department: string
  userID: string
  /** Zero or more Co-Principal Investigators — a proposal is no longer limited to one Co-PI. */
  coPiIds?: string[]
}

// Backend: updateProposal(id: String!, input: UpdateProposalInput!): ProposalPayload!
export interface UpdateProposalInput {
  title?: string
  abstract?: string
  department?: string
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
  fundingCall: ProposalFundingCall
  status: string
  requestedAmount: number
  department: string
  /** ISO date string the proposal was submitted on. */
  submitted: string
  /** The Principal Investigator — the researcher who created the proposal. */
  user: ProposalPI
  /** Zero or more Co-Principal Investigators. */
  coPIs?: ProposalPI[]
  collaborators?: ProposalCollaborator[]
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
  department: string
  /** Zero or more selected Co-PI researcher ids. */
  coPiIds: string[]
}

/** Formik form values for the edit-proposal form */
export interface EditProposalFormValues {
  title: string
  abstract: string
  requestedAmount: number | ''
  department: string
}
