import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type {
  CreateProposalInput,
  CreateProposalPayload,
  CreateProposalResponse,
} from '../types/proposal.types';
import { CREATE_PROPOSAL_MUTATION } from '@/apollo/mutations';

export function useCreateProposal() {
  const [error, setError] = useState<Error | null>(null);

  const [mutate, { loading, data }] = useMutation<
    CreateProposalResponse,
    { input: CreateProposalInput }
  >(CREATE_PROPOSAL_MUTATION, {
    onError: (err) => setError(err),
  });

  /**
   * Executes the createProposal mutation.
   * Returns the full `CreateProposalPayload` so the caller can inspect
   * `success`, `message`, and `errors` from the backend.
   */
  const createProposal = async (
    input: CreateProposalInput,
  ): Promise<CreateProposalPayload | null> => {
    setError(null);
    try {
      const result = await mutate({ variables: { input } });
      return result.data?.createProposal ?? null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  return { createProposal, loading, error, data };
}
