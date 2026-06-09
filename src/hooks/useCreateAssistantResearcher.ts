import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { SIGN_UP_ASSISTANT_RESEARCHER_MUTATION } from '../gql/mutations/signUpAssistantResearcher'
import type { CreateAssistantResearcherInput, SignUpAssistantResearcherResponse } from '../types/assistantResearcher.types'

export function useCreateAssistantResearcher() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading, data }] = useMutation<
    SignUpAssistantResearcherResponse,
    { content: CreateAssistantResearcherInput }
  >(SIGN_UP_ASSISTANT_RESEARCHER_MUTATION, {
    onError: (err) => {
      setError(err)
    },
  })

  const createAssistantResearcher = async (input: CreateAssistantResearcherInput) => {
    setError(null)
    try {
      const result = await mutate({ variables: { content: input } })
      return result.data?.signUpAssistantResearcher ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { createAssistantResearcher, loading, error, data }
}
