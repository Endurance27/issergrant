import { gql } from '@apollo/client'

// Backend: assignGuestToFundingCall(input: AssignGuestToFundingCallInput!): FundingCallCollaborator!
export const ASSIGN_GUEST_TO_FUNDING_CALL_MUTATION = gql`
  mutation AssignGuestToFundingCall($input: AssignGuestToFundingCallInput!) {
    assignGuestToFundingCall(input: $input) {
      id
      guestId
      fundingCallId
      notes
      createdAt
      guest {
        id
        name
        email
      }
      fundingCall {
        id
        theme
      }
    }
  }
`

// Backend: assignGuestToProposal(input: AssignGuestToProposalInput!): ProposalCollaborator!
export const ASSIGN_GUEST_TO_PROPOSAL_MUTATION = gql`
  mutation AssignGuestToProposal($input: AssignGuestToProposalInput!) {
    assignGuestToProposal(input: $input) {
      id
      guestId
      proposalId
      roleDescription
      createdAt
      guest {
        id
        name
        email
      }
    }
  }
`
