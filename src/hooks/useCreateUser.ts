import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_USER_MUTATION } from '../gql/mutations/createUser'
import type { CreateUserInput, CreateUserResponse } from '../gql/graphql'

// Map frontend display roles to backend GraphQL enum values
const roleToEnum: Record<string, string> = {
  'Admin': 'admin',
  'Researcher': 'researcher',
  'Assistant Researcher': 'assistant_researcher',
  'Finance Officer': 'finance_officer',
}

export function useCreateUser() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading, data }] = useMutation<CreateUserResponse, { input: CreateUserInput }>(
    CREATE_USER_MUTATION,
    {
      onError: (err) => {
        setError(err)
      },
    }
  )

  const createUser = async (input: CreateUserInput) => {
    setError(null)
    try {
      const mappedInput = {
        ...input,
        role: (roleToEnum[input.role] ?? input.role.toLowerCase()) as CreateUserInput['role'],
      }
      const result = await mutate({ variables: { input: mappedInput } })
      return result.data?.createUser ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { createUser, loading, error, data }
}
