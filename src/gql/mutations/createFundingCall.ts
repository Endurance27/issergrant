import { gql } from '@apollo/client'

export const CREATE_FUNDING_CALL_MUTATION = gql`
  mutation CreateFundingCall($content: CreateFundingCallInput!) {
    createFundingCall(content: $content) {
      id
      funder
      theme
      totalAvailable
      maximumAward
      minimumAward
      hasMinMaxAward
      allowsMultipleApplications
      openDate
      originalCallLink
      eligibility
      createdBy
      status
    }
  }
`
