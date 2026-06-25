import { gql } from '@apollo/client'

// Backend has no top-level "researchers" query — researchers are fetched via
// getUsersByRole(role: researcher), the same mechanism used for guests.
export const GET_RESEARCHERS_QUERY = gql`
  query GetResearchers($pagination: PaginationInput) {
    getUsersByRole(role: researcher, pagination: $pagination) {
      users {
        id
        name
        email
        department
        status
      }
      totalCount
    }
  }
`
