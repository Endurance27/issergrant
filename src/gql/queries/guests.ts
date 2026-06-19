import { gql } from '@apollo/client'

export const GET_GUESTS_QUERY = gql`
  query GetGuests {
    guests {
      id
      name
      email
      department
      status
      staffId
      phoneContact
      notes
      assignedResearcherId
      createdAt
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

export const MY_PROPOSALS_QUERY = gql`
  query MyProposals {
    myProposals {
      id
      title
      abstract
      status
      requestedAmount
      department
      submitted
      fundingCallId
      fundingCallTitle
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
  }
`

export const GET_RESEARCHERS_QUERY = gql`
  query GetResearchers {
    researchers {
      id
      name
      email
      department
      status
    }
  }
`

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
