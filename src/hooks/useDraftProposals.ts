import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import type {
  SaveDraftProposalInput,
  UpdateDraftProposalInput,
  DraftProposalPayload,
} from '../types/proposal.types'
import {
  SAVE_DRAFT_PROPOSAL_MUTATION,
  UPDATE_DRAFT_PROPOSAL_MUTATION,
  SUBMIT_PROPOSAL_MUTATION,
} from '../gql/mutations/proposal'
import {
  GET_MY_PROPOSALS_QUERY,
  GET_MY_DRAFT_PROPOSALS_QUERY,
} from '../gql/queries/proposals'

// ── Save Draft ────────────────────────────────────────────────────────────────

interface SaveDraftResponse {
  saveDraftProposal: DraftProposalPayload
}

export function useSaveDraft() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading }] = useMutation<SaveDraftResponse, { input: SaveDraftProposalInput }>(
    SAVE_DRAFT_PROPOSAL_MUTATION,
    { onError: (err) => setError(err) },
  )

  const saveDraft = async (input: SaveDraftProposalInput): Promise<DraftProposalPayload | null> => {
    setError(null)
    try {
      const result = await mutate({ variables: { input } })
      return result.data?.saveDraftProposal ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { saveDraft, loading, error }
}

// ── Update Draft ──────────────────────────────────────────────────────────────

interface UpdateDraftResponse {
  updateDraftProposal: DraftProposalPayload
}

export function useUpdateDraft() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading }] = useMutation<
    UpdateDraftResponse,
    { id: string; input: UpdateDraftProposalInput }
  >(UPDATE_DRAFT_PROPOSAL_MUTATION, { onError: (err) => setError(err) })

  const updateDraft = async (
    id: string,
    input: UpdateDraftProposalInput,
  ): Promise<DraftProposalPayload | null> => {
    setError(null)
    try {
      const result = await mutate({ variables: { id, input } })
      return result.data?.updateDraftProposal ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { updateDraft, loading, error }
}

// ── Submit Proposal ───────────────────────────────────────────────────────────

interface SubmitProposalResponse {
  submitProposal: DraftProposalPayload
}

export function useSubmitProposal() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading }] = useMutation<SubmitProposalResponse, { id: string }>(
    SUBMIT_PROPOSAL_MUTATION,
    { onError: (err) => setError(err) },
  )

  const submitProposal = async (id: string): Promise<DraftProposalPayload | null> => {
    setError(null)
    try {
      const result = await mutate({ variables: { id } })
      return result.data?.submitProposal ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { submitProposal, loading, error }
}

// ── My Proposals ──────────────────────────────────────────────────────────────

export function useMyProposals() {
  return useQuery(GET_MY_PROPOSALS_QUERY)
}

// ── My Draft Proposals ────────────────────────────────────────────────────────

export function useMyDraftProposals() {
  return useQuery(GET_MY_DRAFT_PROPOSALS_QUERY)
}
