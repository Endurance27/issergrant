import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import {
  ASSIGN_GUEST_TO_FUNDING_CALL_MUTATION,
  ASSIGN_GUEST_TO_PROPOSAL_MUTATION,
} from '../gql/mutations/assignGuestToFundingCall'

export interface AssignGuestInput {
  guestId: string; fundingCallId: string; notes?: string
}

export interface AssignGuestToProposalInput {
  guestId: string; proposalId: string; roleDescription?: string
}

interface FundingCallCollaborator {
  id: string; guestId: string; fundingCallId: string; notes?: string | null
  createdAt: string
  guest?: { id: string; name: string; email: string } | null
  fundingCall?: { id: string; theme: string } | null
}

interface ProposalCollaborator {
  id: string; guestId: string; proposalId: string; roleDescription?: string | null
  createdAt: string
  guest?: { id: string; name: string; email: string } | null
}

// Backend exposes assignGuestToFundingCall / assignGuestToProposal — there is no
// "remove assignment" mutation yet, so unassigning isn't supported here.
export function useAssignGuest() {
  const [error, setError] = useState<Error | null>(null)

  const [assignToFundingCallMutate, { loading: assigningToFundingCall }] = useMutation<
    { assignGuestToFundingCall: FundingCallCollaborator },
    { input: AssignGuestInput }
  >(ASSIGN_GUEST_TO_FUNDING_CALL_MUTATION, { onError: (e) => setError(e) })

  const [assignToProposalMutate, { loading: assigningToProposal }] = useMutation<
    { assignGuestToProposal: ProposalCollaborator },
    { input: AssignGuestToProposalInput }
  >(ASSIGN_GUEST_TO_PROPOSAL_MUTATION, { onError: (e) => setError(e) })

  const assignGuest = async (input: AssignGuestInput): Promise<FundingCallCollaborator | null> => {
    setError(null)
    try {
      const r = await assignToFundingCallMutate({ variables: { input } })
      return r.data?.assignGuestToFundingCall ?? null
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      return null
    }
  }

  const assignGuestToProposal = async (
    input: AssignGuestToProposalInput,
  ): Promise<ProposalCollaborator | null> => {
    setError(null)
    try {
      const r = await assignToProposalMutate({ variables: { input } })
      return r.data?.assignGuestToProposal ?? null
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      return null
    }
  }

  return {
    assignGuest,
    assignGuestToProposal,
    loading: assigningToFundingCall || assigningToProposal,
    error,
  }
}
