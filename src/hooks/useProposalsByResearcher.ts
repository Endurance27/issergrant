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

  const proposals: ProposalRecord[] =
    data?.proposalsByResearcher.edges.map((e) => e.node) ?? []

  return {
    proposals,
    totalCount: data?.proposalsByResearcher.totalCount ?? 0,
    loading,
    error,
    refetch,
  }
}
