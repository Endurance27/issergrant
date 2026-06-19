import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type {
  BookmarkGrantCallPayload,
  BookmarkGrantCallResponse,
  BookmarkGrantCallVariables,
} from '../types/bookmark.types';
import { BOOKMARK_GRANT_CALL_MUTATION } from '@/apollo/mutations';

export function useBookmarkGrantCall() {
  const [error, setError] = useState<Error | null>(null);

  const [mutate, { loading, data }] = useMutation<
    BookmarkGrantCallResponse,
    BookmarkGrantCallVariables
  >(BOOKMARK_GRANT_CALL_MUTATION, {
    onError: (err) => setError(err),
  });

  /**
   * Toggles a bookmark for the given funding call.
   * Returns the full payload so the caller can check `success` / `message`.
   */
  const bookmarkGrantCall = async (
    variables: BookmarkGrantCallVariables,
  ): Promise<BookmarkGrantCallPayload | null> => {
    setError(null);
    try {
      const result = await mutate({ variables });
      return result.data?.bookmarkGrantCall ?? null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  return { bookmarkGrantCall, loading, error, data };
}
