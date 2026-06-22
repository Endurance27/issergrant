import { gql } from '@apollo/client'

// Backend: createGuest(content: CreateGuestInput!): CreateUserResult!
export const CREATE_GUEST_MUTATION = gql`
  mutation CreateGuest($content: CreateGuestInput!) {
    createGuest(content: $content) {
      temporaryPassword
      user {
        id
        name
        email
        department
        staffId
        phoneContact
        role
        status
        createdAt
      }
    }
  }
`
