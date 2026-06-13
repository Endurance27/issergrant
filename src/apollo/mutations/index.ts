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

export const CREATE_PROPOSAL_MUTATION: DocumentNode = gql`
  mutation CreateProposal($input: CreateProposalInput!) {
    createProposal(input: $input) {
      success
      message
      errors
      proposal {
        id
        title
        abstract
        userID
        fundingCallId
        fundingCallTitle
        status
        requestedAmount
        department
        submitted

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
`;

export const SIGN_UP_ASSISTANT_RESEARCHER_MUTATION: DocumentNode = gql`
  ${USER_FIELDS}
  mutation SignUpAssistantResearcher($content: CreateAssistantUserContent!) {
    signUpAssistantResearcher(content: $content) {
      temporaryPassword
      user {
        ...UserFields
      }
    }
  }
`;
