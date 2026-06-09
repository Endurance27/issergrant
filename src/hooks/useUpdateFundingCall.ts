import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { UPDATE_FUNDING_CALL_MUTATION } from '../gql/mutations/updateFundingCall'
import type {
  UpdateFundingCallInput,
  UpdateFundingCallResponse,
} from '../types/updateFundingCall.types'

export function useUpdateFundingCall() {
  const [error, setError] = useState<Error | null>(null)

  const [mutate, { loading, data }] = useMutation<
    UpdateFundingCallResponse,
    { content: UpdateFundingCallInput }
  >(UPDATE_FUNDING_CALL_MUTATION, {
    onError: (err) => {
      setError(err)
    },
  })

  /**
   * Builds a patch payload — only includes fields the caller explicitly
   * passed; undefined values are omitted so the server ignores them.
   */
  const updateFundingCall = async (input: UpdateFundingCallInput) => {
    setError(null)
    try {
      // Strip keys whose value is `undefined` so we send a true partial patch
      const content = Object.fromEntries(
        Object.entries(input).filter(([, v]) => v !== undefined)
      ) as UpdateFundingCallInput

      const result = await mutate({ variables: { content } })
      return result.data?.updateFundingCall ?? null
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      return null
    }
  }

  return { updateFundingCall, loading, error, data }
}
