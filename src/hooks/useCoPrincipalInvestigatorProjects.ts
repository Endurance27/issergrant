import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { MY_COPI_PROPOSALS_QUERY } from '../gql/queries/proposals'
import type {
  GetCoPiProposalsResponse,
  GetCoPiProposalsVariables,
  ProposalRecord,
} from '../types/proposal.types'

/** Fetches the proposals where the authenticated researcher is listed as a Co-PI. */
export function useCoPrincipalInvestigatorProjects(variables?: GetCoPiProposalsVariables) {
  const { data, loading, error, refetch } = useQuery<
    GetCoPiProposalsResponse,
    GetCoPiProposalsVariables
  >(MY_COPI_PROPOSALS_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
  })

  // Stable reference across re-renders — see useProposalsByResearcher for why.
  const proposals: ProposalRecord[] = useMemo(
    () => data?.myCoPiProposals.edges.map((e) => e.node) ?? [],
    [data],
  )

  return {
    proposals,
    totalCount: data?.myCoPiProposals.totalCount ?? 0,
    loading,
    error,
    refetch,
  }
}
