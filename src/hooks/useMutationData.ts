import {
  DocumentNode,
  OperationVariables,
  ErrorLike,
  InternalRefetchQueriesInclude,
  FetchResult,
} from '@apollo/client';
import { useMutation } from '@apollo/client/react';

interface UseMutationDataOptions<TData> {
  mutation: DocumentNode;
  options?: {
    onCompleted?: (data: TData) => void;
    onError?: (error: ErrorLike) => void;
    refetchQueries?: InternalRefetchQueriesInclude;
  };
}

interface UseMutationDataResult<TData, TVariables extends OperationVariables> {
  execute: (variables?: TVariables) => Promise<FetchResult<TData>>;
  loading: boolean;
  error: ErrorLike | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: TData | null | any;
}

export function useMutationData<TData, TVariables extends OperationVariables = OperationVariables>({
  mutation,
  options = {},
}: UseMutationDataOptions<TData>): UseMutationDataResult<TData, TVariables> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mutate, { loading, error, data }] = useMutation<TData, TVariables>(mutation as any, {
    onCompleted: options.onCompleted,
    onError: (err: ErrorLike) => {
      console.error('[useMutationData] Mutation error:', String(err));
      options.onError?.(err);
    },
    refetchQueries: options.refetchQueries,
  });

  const execute = (variables?: TVariables): Promise<FetchResult<TData>> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutate({ variables } as any);

  return { execute, loading, error, data };
}
