import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useAuthStore } from '../store/auth.store';
import type {} from '../gql/graphql';
import { SIGN_IN_MUTATION } from '@/apollo/mutations';
import {
  AuthUser,
  Mutation,
  MutationSignInArgs,
  SignInContent,
} from '@/gql/schema-types';

function toUser(authUser: AuthUser): any {
  return {
    authUserId: authUser.id ?? '',
    name: authUser?.email?.split('@')[0].replace(/\./g, ' ') ?? '',
    status: authUser?.user?.status ?? 'active',
    department: authUser?.user?.department ?? '',
    staffId: authUser?.user?.staffId ?? '',
    phoneContact: authUser?.user?.phoneContact ?? '',
    avatar: authUser?.user?.avatar ?? null,
    lastLogin: authUser?.user?.lastLogin ?? null,
    UserId: authUser?.user?.id ?? '',
    role: authUser?.user?.role ?? '',
  };
}

export function useLogin() {
  const [error, setError] = useState<Error | null>(null);
  const storeLogin = useAuthStore((s) => s.login);
  const setLoading = useAuthStore((s) => s.setLoading);

  const [mutate, { loading, data }] = useMutation<Mutation, MutationSignInArgs>(
    SIGN_IN_MUTATION,
    {
      onError: (err) => {
        setLoading(false);
        setError(err);
      },
    },
  );

  const login = async (content: SignInContent): Promise<AuthUser | null> => {
    setError(null);
    setLoading(true);

    try {
      const result = await mutate({ variables: { content } });
      const authUser = result.data?.signIn;

      if (!authUser?.accessToken) {
        setLoading(false);
        setError(new Error('Sign in failed'));
        return null;
      }

      storeLogin(toUser(authUser), authUser.accessToken);
      return authUser;
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    }
  };

  return { login, loading, error, data };
}
