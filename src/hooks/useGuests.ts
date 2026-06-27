import { useQuery } from '@apollo/client/react'
import { GET_GUESTS_BY_ROLE_QUERY, GET_MY_GUESTS_QUERY } from '../gql/queries/guests'
import { useAuthStore } from '../store/auth.store'

export interface Guest {
  id: string
  name: string
  email: string
  department: string
  status: string
  staffId: string
  phoneContact: string
  role: string
  assignedResearcherId?: string | null
  createdAt: string
}

interface GetGuestsByRoleResponse {
  getUsersByRole: { users: Guest[]; totalCount: number }
}

interface GetMyGuestsResponse {
  getUser: { id: string; guests: Guest[] } | null
}

// Admin/Director see every guest in the system; a Researcher only sees the
// guests they've created (assignedResearcherId === their own id).
export function useGuests() {
  const currentUser = useAuthStore((s) => s.user)
  const isOrgWide = currentUser?.role === 'admin' || currentUser?.role === 'director'

  const orgWideQuery = useQuery<GetGuestsByRoleResponse>(GET_GUESTS_BY_ROLE_QUERY, {
    variables: { pagination: { limit: 200, offset: 0 } },
    fetchPolicy: 'cache-and-network',
    skip: !isOrgWide,
  })

  const myGuestsQuery = useQuery<GetMyGuestsResponse>(GET_MY_GUESTS_QUERY, {
    variables: { id: currentUser?.UserId ?? '' },
    fetchPolicy: 'cache-and-network',
    skip: isOrgWide || !currentUser?.UserId,
  })

  const { data, loading, error, refetch } = isOrgWide ? orgWideQuery : myGuestsQuery

  const guests: Guest[] = isOrgWide
    ? (data as GetGuestsByRoleResponse | undefined)?.getUsersByRole.users ?? []
    : (data as GetMyGuestsResponse | undefined)?.getUser?.guests ?? []

  return { guests, loading, error, refetch, isOrgWide }
}
