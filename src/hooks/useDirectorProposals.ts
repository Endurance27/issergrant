import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_ALL_PROPOSALS_QUERY } from '../gql/queries/proposals'
import type {
  GetAllProposalsResponse,
  GetAllProposalsVariables,
  ProposalRecord,
} from '../types/proposal.types'

/**
 * Fetches every *submitted* proposal across the organisation — drafts are a
 * researcher's private work-in-progress and must never surface in the
 * Director's read-only "global activity" view. The backend's `proposals`
 * query only supports a single equality `status` filter, so we fetch
 * everything and drop drafts client-side rather than special-casing one
 * status server-side.
 */
export function useAllSubmittedProposals() {
  const { data, loading, error, refetch } = useQuery<
    GetAllProposalsResponse,
    GetAllProposalsVariables
  >(GET_ALL_PROPOSALS_QUERY, {
    variables: { limit: 200, offset: 0 },
    fetchPolicy: 'cache-and-network',
  })

  const proposals: ProposalRecord[] = useMemo(
    () =>
      (data?.proposals.edges.map((e) => e.node) ?? []).filter(
        (p) => p.status !== 'draft',
      ),
    [data],
  )

  return {
    proposals,
    totalCount: data?.proposals.totalCount ?? 0,
    loading,
    error,
    refetch,
  }
}
