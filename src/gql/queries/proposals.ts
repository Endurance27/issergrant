import { gql } from '@apollo/client'

const PROPOSAL_LIST_FIELDS = gql`
  fragment ProposalListFields on Proposal {
    id
    title
    abstract
    fundingCallId
    fundingCallTitle
    status
    requestedAmount
    department
    submitted
    updatedAt
    principalInvestigator {
      id
      name
      email
      department
    }
    coPrincipalInvestigator {
      id
      name
      email
      department
    }
  }
`

export const GET_MY_PROPOSALS_QUERY = gql`
  ${PROPOSAL_LIST_FIELDS}
  query GetMyProposals {
    myProposals {
      ...ProposalListFields
    }
  }
`

export const GET_MY_DRAFT_PROPOSALS_QUERY = gql`
  ${PROPOSAL_LIST_FIELDS}
  query GetMyDraftProposals {
    myDraftProposals {
      ...ProposalListFields
    }
  }
`

export const GET_ALL_SUBMITTED_PROPOSALS_QUERY = gql`
  query GetAllSubmittedProposals($filter: SubmittedProposalsFilter) {
    allSubmittedProposals(filter: $filter) {
      id title abstract fundingCallId fundingCallTitle status
      requestedAmount department submitted updatedAt
      principalInvestigator { id name email department }
      coPrincipalInvestigator { id name email department }
      collaborators {
        id guestId proposalId roleDescription
        guest { id name email department }
      }
    }
  }
`

export const GET_PROPOSAL_QUERY = gql`
  ${PROPOSAL_LIST_FIELDS}
  query GetProposal($id: ID!) {
    proposal(id: $id) {
      ...ProposalListFields
      collaborators {
        id
        guestId
        proposalId
        roleDescription
        guest {
          id
          name
          email
          department
        }
      }
    }
  }
`

// Backend: proposalsByResearcher(researcherId: ID!, limit?, offset?, status?): ProposalConnection!
export const GET_PROPOSALS_BY_RESEARCHER_QUERY = gql`
  query ProposalsByResearcher($researcherId: ID!, $limit: Int, $offset: Int, $status: String) {
    proposalsByResearcher(researcherId: $researcherId, limit: $limit, offset: $offset, status: $status) {
      edges {
        cursor
        node {
          id
          title
          abstract
          status
          requestedAmount
          submittedAt

          user {
            id
            name
            email
            department
          }

          coPIs {
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        currentPage
        totalPages
      }
      totalCount
    }
  }
`

// Backend: myCoPiProposals(limit?, offset?, search?, status?): ProposalConnection!
// Returns the proposals where the authenticated researcher is listed as a Co-PI.
export const MY_COPI_PROPOSALS_QUERY = gql`
  query MyCoPiProposals($limit: Int, $offset: Int, $search: String, $status: String) {
    myCoPiProposals(limit: $limit, offset: $offset, search: $search, status: $status) {
      edges {
        cursor
        node {
          id
          title
          abstract
          status
          requestedAmount
          submittedAt

          user {
            id
            name
            email
            department
          }

          coPIs {
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
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        currentPage
        totalPages
      }
      totalCount
    }
  }
`
