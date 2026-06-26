import { gql } from '@apollo/client'

const PROPOSAL_FIELDS = gql`
  fragment ProposalFields on Proposal {
    id
    title
    abstract
    fundingCallId
    fundingCallTitle
    status
    requestedAmount
    department
    submitted
    principalInvestigator {
      id
      name
      email
      department
    }
    coPrincipalInvestigator {
      id
      name
      email
      department
    }
    updatedAt
  }
`

export const SAVE_DRAFT_PROPOSAL_MUTATION = gql`
  ${PROPOSAL_FIELDS}
  mutation SaveDraftProposal($input: SaveDraftProposalInput!) {
    saveDraftProposal(input: $input) {
      success
      message
      errors
      proposal {
        ...ProposalFields
      }
    }
  }
`

export const UPDATE_DRAFT_PROPOSAL_MUTATION = gql`
  ${PROPOSAL_FIELDS}
  mutation UpdateDraftProposal($id: ID!, $input: UpdateDraftProposalInput!) {
    updateDraftProposal(id: $id, input: $input) {
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
  mutation SubmitProposal($id: ID!) {
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
