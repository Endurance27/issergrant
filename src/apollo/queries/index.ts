import { gql, DocumentNode } from '@apollo/client';
import { client } from '../index';
import type {
  User,
  GrantCall,
  UsersQueryVariables,
  GrantCallsQueryVariables,
} from '../../gql/graphql';

const USERS_QUERY: DocumentNode = gql`
  query GetUsers($page: Int, $limit: Int, $role: String, $status: String) {
    users(page: $page, limit: $limit, role: $role, status: $status) {
      id
      name
      email
      role
      status
      department
      joined
      avatar
    }
  }
`;

const GRANT_CALLS_QUERY: DocumentNode = gql`
  query GetGrantCalls($page: Int, $limit: Int, $status: String, $category: String) {
    grantCalls(page: $page, limit: $limit, status: $status, category: $category) {
      id
      title
      deadline
      totalBudget
      applications
      status
      category
      description
      eligibility
    }
  }
`;

export async function fetchUsers(variables?: UsersQueryVariables): Promise<User[]> {
  try {
    const result = await client.query<{ users: User[] }, UsersQueryVariables>({
      query: USERS_QUERY,
      variables,
      fetchPolicy: 'network-only',
    });
    return result.data?.users ?? [];
  } catch (error) {
    console.error('[fetchUsers]', error);
    return [];
  }
}

export async function fetchGrantCalls(variables?: GrantCallsQueryVariables): Promise<GrantCall[]> {
  try {
    const result = await client.query<{ grantCalls: GrantCall[] }, GrantCallsQueryVariables>({
      query: GRANT_CALLS_QUERY,
      variables,
      fetchPolicy: 'network-only',
    });
    return result.data?.grantCalls ?? [];
  } catch (error) {
    console.error('[fetchGrantCalls]', error);
    return [];
  }
}
