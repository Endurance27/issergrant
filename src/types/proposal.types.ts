export interface CreateProposalInput {
  title: string
  abstract: string
  fundingCallId: string
  requestedAmount: number
  department: string
  coPrincipalInvestigatorId?: string
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
  fundingCallId: string
  fundingCallTitle: string
  fundingCall: ProposalFundingCall
  status: string
  requestedAmount: number
  department: string
  submitted: boolean
  principalInvestigator: ProposalPI
  coPrincipalInvestigator?: ProposalPI | null
  collaborators?: ProposalCollaborator[]
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
  coPrincipalInvestigatorId: string
}
