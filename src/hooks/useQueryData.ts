import { DocumentNode, OperationVariables, WatchQueryFetchPolicy, ErrorLike } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

interface UseQueryDataOptions<TVariables extends OperationVariables> {
  query: DocumentNode;
  variables?: TVariables;
  fetchPolicy?: WatchQueryFetchPolicy;
  skip?: boolean;
}

interface UseQueryDataResult<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: TData | any;
  loading: boolean;
  error: ErrorLike | undefined;
  refetch: () => void;
}

export function useQueryData<TData, TVariables extends OperationVariables = OperationVariables>({
  query,
  variables,
  fetchPolicy = 'cache-first',
  skip = false,
}: UseQueryDataOptions<TVariables>): UseQueryDataResult<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, loading, error, refetch } = useQuery<TData, TVariables>(query as any, {
    variables,
    fetchPolicy,
    skip,
    onError: (err: ErrorLike) => {
      console.error('[useQueryData] GraphQL error:', String(err));
    },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  return { data, loading, error, refetch };
}
