import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_USER_MUTATION } from '../gql/mutations/createUser'
import type { CreateUserInput, CreateUserResponse } from '../gql/graphql'

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
      const result = await mutate({ variables: { input } })
      return result.data?.createUser ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { createUser, loading, error, data }
}
