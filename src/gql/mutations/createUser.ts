import { gql } from '@apollo/client/core'

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      temporaryPassword
      user {
        id
        authUserId
        avatar
        lastLogin
      }
    }
  }
`
