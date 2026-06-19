import { gql } from '@apollo/client'

export const CREATE_GUEST_MUTATION = gql`
  mutation CreateGuest($input: CreateGuestInput!) {
    createGuest(input: $input) {
      success
      message
      temporaryPassword
      guest {
        id
        name
        email
        department
        staffId
        phoneContact
        notes
        status
        assignedResearcherId
        createdAt
      }
    }
  }
`
