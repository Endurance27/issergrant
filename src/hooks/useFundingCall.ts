import { useQuery } from '@apollo/client/react';
import { GET_FUNDING_CALLS_QUERY } from '../apollo/queries';
import type { FundingCall } from '../types/fundingCall.types';

interface GetFundingCallFilter {
  id?: string;
  funder?: string;
  theme?: string;
  createdBy?: string;
}

export function useFundingCalls(filter?: GetFundingCallFilter) {
  const { data, loading, error, refetch } = useQuery<{
    getFundingCalls: FundingCall[];
  }>(GET_FUNDING_CALLS_QUERY, {
    variables: filter ? { filter } : undefined,
    fetchPolicy: 'cache-and-network',
  });

  return {
    fundingCalls: data?.getFundingCalls ?? [],
    loading,
    error,
    refetch,
  };
}
