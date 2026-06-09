export interface UpdateFundingCallInput {
  id: string

  funder?: string | null
  totalAvailable?: number | null
  maximumAward?: number | null
  theme?: string | null
  description?: string | null

  hasMinMaxAward?: boolean

  minimumAward?: number | null

  allowsMultipleApplications?: 'yes' | 'no'

  openDate?: string | null
  originalCallLink?: string | null

  eligibility?: string[] | null
}

export interface UpdatedFundingCall {
  id: string
  funder: string
  totalAvailable: number
  maximumAward: number
  minimumAward?: number | null
  hasMinMaxAward: boolean
  theme: string
  description: string
  allowsMultipleApplications: 'yes' | 'no'
  openDate: string
  originalCallLink: string
  eligibility: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface UpdateFundingCallResponse {
  updateFundingCall: UpdatedFundingCall
}

export interface EditFundingCallFormValues {
  id: string
  funder: string
  totalAvailable: number
  maximumAward: number
  theme: string
  description: string
  hasMinMaxAward: boolean
  minimumAward: number
  allowsMultipleApplications: 'yes' | 'no'
  openDate: string
  originalCallLink: string
  eligibility: string[]
}
