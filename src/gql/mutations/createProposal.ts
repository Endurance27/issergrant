import { gql } from '@apollo/client'

export const CREATE_PROPOSAL_MUTATION = gql`
  mutation CreateProposal($input: CreateProposalInput!) {
    createProposal(input: $input) {
      success
      message
      errors
      proposal {
        id
        title
        abstract
        fundingCallId
        fundingCallTitle
        status
        requestedAmount
        department
        submitted
        principalInvestigator {
          id
          authUserId
          name
          email
          role
          status
          department
          staffId
          phoneContact
          avatar
          lastLogin
          createdAt
          updatedAt
        }
        coPrincipalInvestigator {
          id
          name
          email
          department
        }
        fundingCall {
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
    }
  }
`
