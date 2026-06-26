import { gql } from '@apollo/client'

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
