import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type {
  CreateFundingCallInput,
  CreateFundingCallResponse,
} from '../types/fundingCall.types';
import { CREATE_FUNDING_CALL_MUTATION } from '@/apollo/mutations';

export function useCreateFundingCall() {
  const [error, setError] = useState<Error | null>(null);

  const [mutate, { loading, data }] = useMutation<
    CreateFundingCallResponse,
    { content: CreateFundingCallInput }
  >(CREATE_FUNDING_CALL_MUTATION, {
    onError: (err) => {
      setError(err);
    },
  });

  const createFundingCall = async (input: CreateFundingCallInput) => {
    setError(null);
    try {
      const result = await mutate({ variables: { content: input } });
      return result.data?.createFundingCall ?? null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  return { createFundingCall, loading, error, data };
}
