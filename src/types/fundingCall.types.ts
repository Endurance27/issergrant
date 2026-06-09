export interface CreateFundingCallInput {
  funder: string
  totalAvailable: number
  maximumAward: number
  theme: string
  description: string
  hasMinMaxAward: boolean
  minimumAward?: number
  allowsMultipleApplications: 'yes' | 'no'
  openDate: string
  originalCallLink: string
  eligibility: string[]
  createdBy: string
}

export interface FundingCall {
  id: string
  funder: string
  totalAvailable: number
  maximumAward: number
  minimumAward?: number
  hasMinMaxAward: boolean
  theme: string
  description: string
  allowsMultipleApplications: 'yes' | 'no'
  openDate: string
  originalCallLink: string
  eligibility: string[]
  createdBy: string
  status: string
}

export interface CreateFundingCallResponse {
  createFundingCall: FundingCall
}

export interface CreateFundingCallFormValues {
  funder: string
  totalAvailable: number | ''
  maximumAward: number | ''
  theme: string
  description: string
  hasMinMaxAward: boolean
  minimumAward: number | ''
  allowsMultipleApplications: 'yes' | 'no'
  openDate: string
  originalCallLink: string
  eligibility: string[]
}
