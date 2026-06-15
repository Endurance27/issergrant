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

export const GET_FUNDING_CALLS_QUERY: DocumentNode = gql`
  query GetFundingCalls($filter: GetFundingCallFilter) {
    getFundingCalls(filter: $filter) {
      id
      allowsMultipleApplications
      eligibility
      description
      originalCallLink
      theme
      totalAvailable
      createdBy
      funder
      hasMinMaxAward
      maximumAward
      minimumAward
      openDate
    }
  }
`;
