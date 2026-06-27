import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import type {
  DraftProposalPayload,
  ProposalRecord,
  GetMyProposalDraftsResponse,
  GetMyProposalDraftsVariables,
} from '../types/proposal.types';
import {
  SAVE_PROPOSAL_DRAFT_MUTATION,
  SUBMIT_PROPOSAL_MUTATION,
} from '../gql/mutations/proposal';
import { MY_PROPOSAL_DRAFTS_QUERY } from '../gql/queries/proposals';
import {
  Mutation,
  MutationSaveProposalDraftArgs,
  ProposalPayload,
  SaveProposalDraftInput,
} from '@/gql/schema-types';

// ── Save Draft ────────────────────────────────────────────────────────────────
// Creates a new draft when input.id is omitted, or updates an existing one in
// place when it's supplied — the backend exposes both behind a single mutation.

interface SaveProposalDraftResponse {
  saveProposalDraft: DraftProposalPayload;
}

export function useSaveDraft() {
  const [error, setError] = useState<Error | null>(null);

  const [mutate, { loading }] = useMutation<
    Mutation,
    MutationSaveProposalDraftArgs
  >(SAVE_PROPOSAL_DRAFT_MUTATION, { onError: (err) => setError(err) });

  const saveDraft = async (
    input: SaveProposalDraftInput,
  ): Promise<ProposalPayload | null> => {
    setError(null);
    try {
      const result = await mutate({ variables: { input } });
      return result.data?.saveProposalDraft ?? null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  return { saveDraft, loading, error };
}

// ── Submit Proposal ───────────────────────────────────────────────────────────
// Validates the draft is complete and transitions it to submitted.

interface SubmitProposalResponse {
  submitProposal: DraftProposalPayload;
}

export function useSubmitProposal() {
  const [error, setError] = useState<Error | null>(null);

  const [mutate, { loading }] = useMutation<
    SubmitProposalResponse,
    { id: string }
  >(SUBMIT_PROPOSAL_MUTATION, { onError: (err) => setError(err) });

  const submitProposal = async (
    id: string,
  ): Promise<DraftProposalPayload | null> => {
    setError(null);
    try {
      const result = await mutate({ variables: { id } });
      return result.data?.submitProposal ?? null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  return { submitProposal, loading, error };
}

// ── My Draft Proposals ────────────────────────────────────────────────────────

export function useMyDraftProposals(search?: string) {
  const { data, loading, error, refetch } = useQuery<
    GetMyProposalDraftsResponse,
    GetMyProposalDraftsVariables
  >(MY_PROPOSAL_DRAFTS_QUERY, {
    variables: { search, limit: 200, offset: 0 },
    fetchPolicy: 'cache-and-network',
  });

  const drafts: ProposalRecord[] = useMemo(
    () => data?.myProposalDrafts.edges.map((e) => e.node) ?? [],
    [data],
  );

  return {
    drafts,
    totalCount: data?.myProposalDrafts.totalCount ?? 0,
    loading,
    error,
    refetch,
  };
}
