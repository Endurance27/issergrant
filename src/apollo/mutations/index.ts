import { gql, DocumentNode } from '@apollo/client';

const USER_FIELDS = gql`
  fragment UserFields on User {
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
`;

export const CREATE_USER_MUTATION: DocumentNode = gql`
  ${USER_FIELDS}
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      temporaryPassword
      user {
        ...UserFields
      }
    }
  }
`;

export const UPDATE_USER_MUTATION: DocumentNode = gql`
  ${USER_FIELDS}
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ...UserFields
    }
  }
`;

export const UPDATE_USER_STATUS_MUTATION: DocumentNode = gql`
  mutation UpdateUserStatus($input: UserStatusInput!) {
    updateUserStatus(input: $input) {
      id
      status
    }
  }
`;

export const SIGN_IN_MUTATION: DocumentNode = gql`
  mutation SignIn($content: SignInContent) {
    signIn(content: $content) {
      accessToken
      account_type
      email
      id
      user {
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
    }
  }
`;

export const BOOKMARK_GRANT_CALL_MUTATION: DocumentNode = gql`
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
`;

export const CREATE_FUNDING_CALL_MUTATION: DocumentNode = gql`
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
    }
  }
`;

export const UPDATE_FUNDING_CALL_MUTATION: DocumentNode = gql`
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
`;

// Shared selection set for a Proposal — used by create/update/remove-CoPI
// below. Proposal has no flat fundingCallId/fundingCallTitle/userID fields;
// the funding call and the PI/Co-PIs are only reachable as nested objects.
const PROPOSAL_FIELDS = gql`
  fragment ProposalFields on Proposal {
    id
    title
    abstract
    status
    requestedAmount
    submittedAt

    user {
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
`;

export const CREATE_PROPOSAL_MUTATION: DocumentNode = gql`
  ${PROPOSAL_FIELDS}
  mutation CreateProposal($input: CreateProposalInput!) {
    createProposal(input: $input) {
      success
      message
      errors
      proposal {
        ...ProposalFields
      }
    }
  }
`;

export const UPDATE_PROPOSAL_MUTATION: DocumentNode = gql`
  ${PROPOSAL_FIELDS}
  mutation UpdateProposal($id: String!, $input: UpdateProposalInput!) {
    updateProposal(id: $id, input: $input) {
      success
      message
      errors
      proposal {
        ...ProposalFields
      }
    }
  }
`;

// There is no "add Co-PI to an existing proposal" mutation on the backend —
// Co-PIs are set at creation time via CreateProposalInput.coPiIds. This is
// the only post-creation Co-PI management mutation available.
export const REMOVE_PROPOSAL_COPI_MUTATION: DocumentNode = gql`
  ${PROPOSAL_FIELDS}
  mutation RemoveProposalCoPi($proposalId: ID!, $userId: ID!) {
    removeProposalCoPi(proposalId: $proposalId, userId: $userId) {
      success
      message
      errors
      proposal {
        ...ProposalFields
      }
    }
  }
`;

// export const SIGN_UP_ASSISTANT_RESEARCHER_MUTATION: DocumentNode = gql`
//   ${USER_FIELDS}
//   mutation SignUpAssistantResearcher($content: CreateAssistantUserContent!) {
//     signUpAssistantResearcher(content: $content) {
//       temporaryPassword
//       user {
//         ...UserFields
//       }
//     }
//   }
// `;
