import { gql } from '@apollo/client'

export const ASSIGN_GUEST_TO_FUNDING_CALL_MUTATION = gql`
  mutation AssignGuestToFundingCall($input: AssignGuestInput!) {
    assignGuestToFundingCall(input: $input) {
      success
      message
      assignment {
        id
        guestId
        fundingCallId
        fundingCallTitle
        notes
        assignedAt
      }
    }
  }
`

export const REMOVE_GUEST_ASSIGNMENT_MUTATION = gql`
  mutation RemoveGuestAssignment($assignmentId: ID!) {
    removeGuestAssignment(assignmentId: $assignmentId) {
      success
      message
    }
  }
`
