import { gql } from '@apollo/client'

// Shared selection set for any Proposal returned inside a ProposalConnection.
const PROPOSAL_CONNECTION_FIELDS = gql`
  fragment ProposalConnectionFields on ProposalConnection {
    edges {
      cursor
      node {
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
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
      currentPage
      totalPages
    }
    totalCount
  }
`

// Backend: myProposalDrafts(search?, limit?, offset?): ProposalConnection!
// Draft proposals where the logged-in researcher is the PI or a Co-PI.
export const MY_PROPOSAL_DRAFTS_QUERY = gql`
  ${PROPOSAL_CONNECTION_FIELDS}
  query MyProposalDrafts($search: String, $limit: Int, $offset: Int) {
    myProposalDrafts(search: $search, limit: $limit, offset: $offset) {
      ...ProposalConnectionFields
    }
  }
`

// Backend: proposals(search?, status?, limit?, offset?): ProposalConnection!
// Org-wide listing (not scoped to a single researcher) — used by Director/Admin views.
export const GET_ALL_PROPOSALS_QUERY = gql`
  ${PROPOSAL_CONNECTION_FIELDS}
  query GetAllProposals($search: String, $status: String, $limit: Int, $offset: Int) {
    proposals(search: $search, status: $status, limit: $limit, offset: $offset) {
      ...ProposalConnectionFields
    }
  }
`

// Backend: proposalsByResearcher(researcherId: ID!, limit?, offset?, status?): ProposalConnection!
export const GET_PROPOSALS_BY_RESEARCHER_QUERY = gql`
  query ProposalsByResearcher($researcherId: ID!, $limit: Int, $offset: Int, $status: String) {
    proposalsByResearcher(researcherId: $researcherId, limit: $limit, offset: $offset, status: $status) {
      edges {
        cursor
        node {
          id
          title
          abstract
          status
          requestedAmount
          submittedAt

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
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        currentPage
        totalPages
      }
      totalCount
    }
  }
`

// Backend: myCoPiProposals(limit?, offset?, search?, status?): ProposalConnection!
// Returns the proposals where the authenticated researcher is listed as a Co-PI.
export const MY_COPI_PROPOSALS_QUERY = gql`
  query MyCoPiProposals($limit: Int, $offset: Int, $search: String, $status: String) {
    myCoPiProposals(limit: $limit, offset: $offset, search: $search, status: $status) {
      edges {
        cursor
        node {
          id
          title
          abstract
          status
          requestedAmount
          submittedAt

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
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        currentPage
        totalPages
      }
      totalCount
    }
  }
`
