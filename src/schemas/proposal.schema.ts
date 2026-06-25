import * as Yup from 'yup'

/** Used by the existing Supabase-backed inline form in Proposals.tsx */
export const proposalSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  grantCallId: Yup.string().required('Grant call is required'),
  requestedAmount: Yup.number().positive('Must be positive').required('Amount is required'),
  department: Yup.string().required('Department is required'),
  abstract: Yup.string().min(50, 'Abstract must be at least 50 characters').required('Abstract is required'),
})

/** Used by the GraphQL-backed CreateProposalForm */
export const createProposalSchema = Yup.object({
  title: Yup.string().trim().required('Title is required'),
  abstract: Yup.string()
    .trim()
    .min(50, 'Abstract must be at least 50 characters')
    .required('Abstract is required'),
  fundingCallId: Yup.string().required('Please select a funding call'),
  requestedAmount: Yup.number()
    .typeError('Must be a number')
    .positive('Requested amount must be greater than 0')
    .required('Requested amount is required'),
  department: Yup.string().trim().required('Department is required'),
  // A proposal may have zero or more Co-PIs — no minimum, but every id must
  // be unique (defends against duplicate selection slipping through).
  coPiIds: Yup.array()
    .of(Yup.string().required())
    .test('unique', 'Duplicate Co-PI selected', (ids) => !ids || new Set(ids).size === ids.length)
    .default([]),
})

/** Used by the GraphQL-backed EditProposalForm */
export const updateProposalSchema = Yup.object({
  title: Yup.string().trim().required('Title is required'),
  abstract: Yup.string()
    .trim()
    .min(50, 'Abstract must be at least 50 characters')
    .required('Abstract is required'),
  requestedAmount: Yup.number()
    .typeError('Must be a number')
    .positive('Requested amount must be greater than 0')
    .required('Requested amount is required'),
  department: Yup.string().trim().required('Department is required'),
})
