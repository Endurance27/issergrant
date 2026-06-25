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
          department
          submitted

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
