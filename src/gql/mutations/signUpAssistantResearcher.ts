import { gql } from '@apollo/client/core'

export const SIGN_UP_ASSISTANT_RESEARCHER_MUTATION = gql`
  mutation SignUpAssistantResearcher($content: SignUpAssistantResearcherInput!) {
    signUpAssistantResearcher(content: $content) {
      id
      authUserId
      name
      email
      role
      department
      staffId
      phoneContact
      avatar
      lastLogin
      createdAt
      updatedAt
    }
  }
`
