import { useQuery } from '@apollo/client/react';
import { GET_USERS_QUERY } from '../apollo/queries';
import { User } from '@/types/user.types';

export function useUsers() {
  const { data, loading, error, refetch } = useQuery<{
    getUsers: { users: User[]; totalCount: number };
  }>(GET_USERS_QUERY, { fetchPolicy: 'cache-and-network' });

  return {
    users: data?.getUsers?.users ?? [],
    totalCount: data?.getUsers?.totalCount ?? 0,
    loading,
    error,
    refetch,
  };
}
