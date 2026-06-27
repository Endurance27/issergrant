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

  const proposals: ProposalRecord[] =
    data?.myCoPiProposals.edges.map((e) => e.node) ?? []

  return {
    proposals,
    totalCount: data?.myCoPiProposals.totalCount ?? 0,
    loading,
    error,
    refetch,
  }
}
