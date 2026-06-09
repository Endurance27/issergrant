import { gql } from '@apollo/client'

export const BOOKMARK_GRANT_CALL_MUTATION = gql`
  mutation BookmarkGrantCall(
    $fundingCallId: ID!
    $userID: ID!
    $notes: String
  ) {
    bookmarkGrantCall(
      fundingCallId: $fundingCallId
      userID: $userID
      notes: $notes
    ) {
      success
      message
      grantCall {
        id
        title
        description
        category
        totalBudget
        deadline
        eligibility
        status
        applicationCount
        isBookmarked
        bookmarkNotes
      }
      bookmark {
        id
        userID
        fundingCallId
        fundingCallTitle
        notes
        bookmarkedAt
      }
    }
  }
`
