import { useQuery } from '@apollo/client/react'
import { GET_ALL_SUBMITTED_PROPOSALS_QUERY } from '../gql/queries/proposals'
import type { SubmittedProposalsFilter, ProposalRecord } from '../types/proposal.types'

interface AllSubmittedProposalsResponse {
  allSubmittedProposals: ProposalRecord[]
}

export function useAllSubmittedProposals(filter?: SubmittedProposalsFilter) {
  const { data, loading, error, refetch } = useQuery<AllSubmittedProposalsResponse>(
    GET_ALL_SUBMITTED_PROPOSALS_QUERY,
    {
      variables: filter ? { filter } : undefined,
      fetchPolicy: 'cache-and-network',
    },
  )

  return {
    proposals: data?.allSubmittedProposals ?? [],
    loading,
    error,
    refetch,
  }
}
