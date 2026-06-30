import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  APPROVE_PROPOSAL_MUTATION,
  REJECT_PROPOSAL_MUTATION,
  REQUEST_REVISION_MUTATION,
} from '../gql/mutations/proposal'
import type {
  Mutation,
  MutationApproveProposalArgs,
  MutationRejectProposalArgs,
  MutationRequestRevisionArgs,
  ProposalPayload,
} from '@/gql/schema-types'
import { GET_ALL_PROPOSALS_QUERY } from '../gql/queries/proposals'

export function useApproveProposal() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading }] = useMutation<Mutation, MutationApproveProposalArgs>(
    APPROVE_PROPOSAL_MUTATION,
    {
      refetchQueries: [{ query: GET_ALL_PROPOSALS_QUERY, variables: { limit: 200, offset: 0 } }],
      onError: (err) => setError(err),
    },
  )

  const approveProposal = async (input: {
    id: string
    comment: string
    reviewerNotes?: string
  }): Promise<ProposalPayload | null> => {
    setError(null)
    try {
      const result = await mutate({ variables: { input } })
      return result.data?.approveProposal ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { approveProposal, loading, error }
}

export function useRejectProposal() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading }] = useMutation<Mutation, MutationRejectProposalArgs>(
    REJECT_PROPOSAL_MUTATION,
    {
      refetchQueries: [{ query: GET_ALL_PROPOSALS_QUERY, variables: { limit: 200, offset: 0 } }],
      onError: (err) => setError(err),
    },
  )

  const rejectProposal = async (input: {
    id: string
    reason: string
    reviewerNotes?: string
  }): Promise<ProposalPayload | null> => {
    setError(null)
    try {
      const result = await mutate({ variables: { input } })
      return result.data?.rejectProposal ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { rejectProposal, loading, error }
}

export function useRequestRevision() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading }] = useMutation<Mutation, MutationRequestRevisionArgs>(
    REQUEST_REVISION_MUTATION,
    {
      refetchQueries: [{ query: GET_ALL_PROPOSALS_QUERY, variables: { limit: 200, offset: 0 } }],
      onError: (err) => setError(err),
    },
  )

  const requestRevision = async (input: {
    id: string
    comment: string
  }): Promise<ProposalPayload | null> => {
    setError(null)
    try {
      const result = await mutate({ variables: { input } })
      return result.data?.requestRevision ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { requestRevision, loading, error }
}
