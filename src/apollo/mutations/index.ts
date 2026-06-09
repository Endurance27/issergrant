import { gql, DocumentNode } from '@apollo/client';
import { client } from '../index';
import type {
  User,
  CreateUserVariables,
  UpdateUserVariables,
} from '../../gql/graphql';

const CREATE_USER_MUTATION: DocumentNode = gql`
  mutation CreateUser($name: String!, $email: String!, $role: String!, $department: String!) {
    createUser(name: $name, email: $email, role: $role, department: $department) {
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

const UPDATE_USER_MUTATION: DocumentNode = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $role: String, $status: String, $department: String) {
    updateUser(id: $id, name: $name, email: $email, role: $role, status: $status, department: $department) {
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

export async function createUser(variables: CreateUserVariables): Promise<User | null> {
  try {
    const { data } = await client.mutate<{ createUser: User }, CreateUserVariables>({
      mutation: CREATE_USER_MUTATION,
      variables,
    });
    return data?.createUser ?? null;
  } catch (error) {
    console.error('[createUser]', error);
    return null;
  }
}

export async function updateUser(variables: UpdateUserVariables): Promise<User | null> {
  try {
    const { data } = await client.mutate<{ updateUser: User }, UpdateUserVariables>({
      mutation: UPDATE_USER_MUTATION,
      variables,
    });
    return data?.updateUser ?? null;
  } catch (error) {
    console.error('[updateUser]', error);
    return null;
  }
}
