import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_GUEST_MUTATION } from '../gql/mutations/createGuest'

export interface CreateGuestInput {
  name: string
  email: string
  department: string
  staffId: string
  phoneContact: string
  notes: string
  assignedResearcherId: string
}

interface GuestRecord {
  id: string; name: string; email: string; department: string
  staffId: string; phoneContact: string; notes?: string
  status: string; assignedResearcherId: string; createdAt: string
}

interface CreateGuestPayload {
  success: boolean; message: string
  temporaryPassword?: string; guest?: GuestRecord | null
}

interface CreateGuestResponse { createGuest: CreateGuestPayload }

export function useCreateGuest() {
  const [error, setError] = useState<Error | null>(null)
  const [mutate, { loading, data }] = useMutation<CreateGuestResponse, { input: CreateGuestInput }>(
    CREATE_GUEST_MUTATION, { onError: (err) => setError(err) }
  )
  const createGuest = async (input: CreateGuestInput): Promise<CreateGuestPayload | null> => {
    setError(null)
    try {
      const result = await mutate({ variables: { input } })
      return result.data?.createGuest ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }
  return { createGuest, loading, error, data }
}
