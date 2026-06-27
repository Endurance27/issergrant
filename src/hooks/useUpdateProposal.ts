import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type {
  UpdateProposalInput,
  UpdateProposalPayload,
  UpdateProposalResponse,
  RemoveProposalCoPiResponse,
} from '../types/proposal.types';
import {
  UPDATE_PROPOSAL_MUTATION,
  REMOVE_PROPOSAL_COPI_MUTATION,
} from '@/apollo/mutations';

/**
 * Editing an existing proposal. The backend only supports updating the core
 * fields (title/abstract/department/requestedAmount) and removing an
 * existing Co-PI — there is no mutation to add a Co-PI after creation.
 */
export function useUpdateProposal() {
  const [error, setError] = useState<Error | null>(null);

  const [updateMutate, { loading: updating }] = useMutation<
    UpdateProposalResponse,
    { id: string; input: UpdateProposalInput }
  >(UPDATE_PROPOSAL_MUTATION, { onError: (err) => setError(err) });

  const [removeCoPiMutate, { loading: removingCoPi }] = useMutation<
    RemoveProposalCoPiResponse,
    { proposalId: string; userId: string }
  >(REMOVE_PROPOSAL_COPI_MUTATION, { onError: (err) => setError(err) });

  const updateProposal = async (
    id: string,
    input: UpdateProposalInput,
  ): Promise<UpdateProposalPayload | null> => {
    setError(null);
    try {
      const result = await updateMutate({ variables: { id, input } });
      return result.data?.updateProposal ?? null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  const removeCoPi = async (
    proposalId: string,
    userId: string,
  ): Promise<UpdateProposalPayload | null> => {
    setError(null);
    try {
      const result = await removeCoPiMutate({ variables: { proposalId, userId } });
      return result.data?.removeProposalCoPi ?? null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  return { updateProposal, removeCoPi, loading: updating || removingCoPi, error };
}
