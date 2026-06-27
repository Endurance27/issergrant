import { useQuery } from '@apollo/client/react'
import { GET_RESEARCHERS_QUERY } from '../gql/queries/researchers'

export interface Researcher {
  id: string
  name: string
  email: string
  department: string
  status: string
}

interface GetResearchersResponse {
  getUsersByRole: { users: Researcher[]; totalCount: number }
}

/** Fetches every researcher in the system (used for the Co-PI picker). */
export function useResearchers() {
  const { data, loading, error, refetch } = useQuery<GetResearchersResponse>(
    GET_RESEARCHERS_QUERY,
    {
      variables: { pagination: { limit: 200, offset: 0 } },
      fetchPolicy: 'cache-and-network',
    },
  )

  return {
    researchers: data?.getUsersByRole.users ?? [],
    loading,
    error,
    refetch,
  }
}
