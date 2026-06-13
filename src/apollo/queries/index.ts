import { gql, DocumentNode } from '@apollo/client';
import { client } from '../index';

export const GET_USERS_QUERY: DocumentNode = gql`
  query GetUsers {
    getUsers {
      users {
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
      totalCount
    }
  }
`;

const GRANT_CALLS_QUERY: DocumentNode = gql`
  query GetGrantCalls(
    $search: String
    $status: String
    $category: String
    $limit: Int
    $offset: Int
    $userID: ID
  ) {
    grantCalls(
      search: $search
      status: $status
      category: $category
      limit: $limit
      offset: $offset
      userID: $userID
    ) {
      edges {
        node {
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
      }
      totalCount
    }
  }
`;
