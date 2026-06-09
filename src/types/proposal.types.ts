export interface CreateProposalInput {
  title: string
  abstract: string
  fundingCallId: string
  userID: string
  requestedAmount: number
  department: string
}

export interface ProposalUser {
  id: string
  authUserId: string
  name: string
  email: string
  role: string
  status: string
  department: string
  staffId: string
  phoneContact: string
  avatar?: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
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
  userID: string
  user: ProposalUser
  fundingCallId: string
  fundingCallTitle: string
  fundingCall: ProposalFundingCall
  status: string
  requestedAmount: number
  department: string
  submitted: boolean
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

/** Formik form values for the create-proposal form */
export interface CreateProposalFormValues {
  title: string
  abstract: string
  fundingCallId: string
  requestedAmount: number | ''
  department: string
}
