import { gql } from '@apollo/client'

export const UPDATE_FUNDING_CALL_MUTATION = gql`
  mutation UpdateFundingCall($content: UpdateFundingCallInput!) {
    updateFundingCall(content: $content) {
      id
      funder
      totalAvailable
      maximumAward
      theme
      description
      hasMinMaxAward
      minimumAward
      allowsMultipleApplications
      openDate
      originalCallLink
      eligibility
      createdBy
      createdAt
      updatedAt
    }
  }
`
