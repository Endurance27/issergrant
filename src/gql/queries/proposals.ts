import { gql } from '@apollo/client'

const PROPOSAL_LIST_FIELDS = gql`
  fragment ProposalListFields on Proposal {
    id
    title
    abstract
    fundingCallId
    fundingCallTitle
    status
    requestedAmount
    department
    submitted
    updatedAt
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
  }
`

export const GET_MY_PROPOSALS_QUERY = gql`
  ${PROPOSAL_LIST_FIELDS}
  query GetMyProposals {
    myProposals {
      ...ProposalListFields
    }
  }
`

export const GET_MY_DRAFT_PROPOSALS_QUERY = gql`
  ${PROPOSAL_LIST_FIELDS}
  query GetMyDraftProposals {
    myDraftProposals {
      ...ProposalListFields
    }
  }
`

export const GET_PROPOSAL_QUERY = gql`
  ${PROPOSAL_LIST_FIELDS}
  query GetProposal($id: ID!) {
    proposal(id: $id) {
      ...ProposalListFields
      collaborators {
        id
        guestId
        proposalId
        roleDescription
        guest {
          id
          name
          email
          department
        }
      }
    }
  }
`
