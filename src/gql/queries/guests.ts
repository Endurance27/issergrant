import { gql } from '@apollo/client'

// Backend has no top-level "guests" query — guests are reached either via
// getUsersByRole(role: GUEST) for org-wide visibility (Admin/Director), or via
// getUser(id).guests for a researcher's own assigned guests.
export const GET_GUESTS_BY_ROLE_QUERY = gql`
  query GetGuestsByRole($pagination: PaginationInput) {
    getUsersByRole(role: guest, pagination: $pagination) {
      users {
        id
        name
        email
        department
        status
        staffId
        phoneContact
        role
        assignedResearcherId
        createdAt
      }
      totalCount
    }
  }
`

export const GET_MY_GUESTS_QUERY = gql`
  query GetMyGuests($id: ID!) {
    getUser(id: $id) {
      id
      guests {
        id
        name
        email
        department
        status
        staffId
        phoneContact
        role
        assignedResearcherId
        createdAt
      }
    }
  }
`

export const MY_FUNDING_CALLS_QUERY = gql`
  query MyFundingCalls {
    myFundingCalls {
      id
      funder
      theme
      description
      openDate
      status
      totalAvailable
      maximumAward
      eligibility
    }
  }
`

// Researcher lookup now lives in gql/queries/researchers.ts (uses
// getUsersByRole — there's no top-level "researchers" query on the backend).

export const GET_PROPOSAL_COLLABORATORS_QUERY = gql`
  query GetProposalCollaborators($proposalId: ID!) {
    proposalCollaborators(proposalId: $proposalId) {
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
`
