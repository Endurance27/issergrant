import { gql } from '@apollo/client'

const PROPOSAL_FIELDS = gql`
  fragment ProposalFields on Proposal {
    id
    title
    abstract
    status
    requestedAmount
    submittedAt
    createdAt
    updatedAt
    user {
      id
      name
      email
      department
    }
    coPIs {
      id
      name
      email
      department
    }
    fundingCall {
      id
      funder
      totalAvailable
      maximumAward
      theme
      description
      hasMinMaxAward
      minimumAward
      allowsMultipleApplications
      openDate
      originalCallLink
      eligibility
      createdBy
      createdAt
      updatedAt
    }
  }
`

// Creates a new draft when input.id is omitted, or updates an existing one
// in place when it's supplied. Only field-format validation runs here —
// completeness is enforced separately by SUBMIT_PROPOSAL_MUTATION.
export const SAVE_PROPOSAL_DRAFT_MUTATION = gql`
  ${PROPOSAL_FIELDS}
  mutation SaveProposalDraft($input: SaveProposalDraftInput!) {
    saveProposalDraft(input: $input) {
      success
      message
      errors
      proposal {
        ...ProposalFields
      }
    }
  }
`

export const SUBMIT_PROPOSAL_MUTATION = gql`
  ${PROPOSAL_FIELDS}
  mutation SubmitProposal($id: String!) {
    submitProposal(id: $id) {
      success
      message
      errors
      proposal {
        ...ProposalFields
      }
    }
  }
`
