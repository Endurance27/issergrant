import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_GUEST_MUTATION } from '../gql/mutations/createGuest'

// Mirrors the backend's CreateGuestInput (notes/assignmentType/resource* are optional there;
// the form only ever sends the fields below).
export interface CreateGuestInput {
  name: string
  email: string
  department: string
  staffId: string
  phoneContact: string
  notes?: string
  assignedResearcherId: string
}

interface CreateGuestUser {
  id: string; name: string; email: string; department: string
  staffId: string; phoneContact: string; role: string; status: string
  createdAt: string
}

// Backend: createGuest(content: CreateGuestInput!): CreateUserResult!
interface CreateGuestPayload {
  temporaryPassword: string
  user: CreateGuestUser
}

interface CreateGuestResponse { createGuest: CreateGuestPayload }

export function useCreateGuest() {
  const [error, setError] = useState<Error | null>(null)
  const [mutate, { loading, data }] = useMutation<CreateGuestResponse, { content: CreateGuestInput }>(
    CREATE_GUEST_MUTATION, { onError: (err) => setError(err) }
  )
  const createGuest = async (content: CreateGuestInput): Promise<CreateGuestPayload | null> => {
    setError(null)
    try {
      const result = await mutate({ variables: { content } })
      return result.data?.createGuest ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }
  return { createGuest, loading, error, data }
}
