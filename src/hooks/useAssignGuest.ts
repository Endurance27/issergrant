import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ASSIGN_GUEST_TO_FUNDING_CALL_MUTATION, REMOVE_GUEST_ASSIGNMENT_MUTATION } from '../gql/mutations/assignGuestToFundingCall'

export interface AssignGuestInput {
  guestId: string; fundingCallId: string; notes?: string
}

export function useAssignGuest() {
  const [error, setError] = useState<Error | null>(null)
  interface AssignResult { assignGuestToFundingCall: { success: boolean; message: string; assignment?: unknown } }
  interface RemoveResult { removeGuestAssignment: { success: boolean; message: string } }

  const [assignMutate, { loading: assigning }] = useMutation<AssignResult>(ASSIGN_GUEST_TO_FUNDING_CALL_MUTATION, { onError: (e) => setError(e) })
  const [removeMutate, { loading: removing }] = useMutation<RemoveResult>(REMOVE_GUEST_ASSIGNMENT_MUTATION, { onError: (e) => setError(e) })

  const assignGuest = async (input: AssignGuestInput) => {
    setError(null)
    try {
      const r = await assignMutate({ variables: { input } })
      return r.data?.assignGuestToFundingCall ?? null
    } catch (e) { setError(e instanceof Error ? e : new Error(String(e))); return null }
  }

  const removeAssignment = async (assignmentId: string) => {
    setError(null)
    try {
      const r = await removeMutate({ variables: { assignmentId } })
      return r.data?.removeGuestAssignment ?? null
    } catch (e) { setError(e instanceof Error ? e : new Error(String(e))); return null }
  }

  return { assignGuest, removeAssignment, loading: assigning || removing, error }
}
