import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { GET_PROPOSALS_BY_RESEARCHER_QUERY } from '../gql/queries/proposals'
import type { ProposalConnection, ProposalRecord } from '../types/proposal.types'

interface GetProposalsByResearcherResponse {
  proposalsByResearcher: ProposalConnection
}

interface GetProposalsByResearcherVariables {
  researcherId: string
  limit?: number
  offset?: number
  status?: string
}

/** Fetches the proposals a researcher created, looked up by their userId. */
export function useProposalsByResearcher(researcherId: string, status?: string) {
  const { data, loading, error, refetch } = useQuery<
    GetProposalsByResearcherResponse,
    GetProposalsByResearcherVariables
  >(GET_PROPOSALS_BY_RESEARCHER_QUERY, {
    variables: { researcherId, limit: 200, offset: 0, status },
    fetchPolicy: 'cache-and-network',
    skip: !researcherId,
  })

  // Memoized so callers get a stable array reference across re-renders when
  // `data` hasn't actually changed — otherwise a `.map()`'s fresh array on
  // every render trips any effect that depends on `proposals` into a loop.
  const proposals: ProposalRecord[] = useMemo(
    () => data?.proposalsByResearcher.edges.map((e) => e.node) ?? [],
    [data],
  )

  return {
    proposals,
    totalCount: data?.proposalsByResearcher.totalCount ?? 0,
    loading,
    error,
    refetch,
  }
}
