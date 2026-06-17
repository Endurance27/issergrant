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

export const GET_AUDIT_LOGS_QUERY: DocumentNode = gql`
  query AuditLogs(
    $filter: AuditLogFilterInput
    $pagination: AuditLogPaginationInput
    $sortDirection: SortDirection
  ) {
    auditLogs(
      filter: $filter
      pagination: $pagination
      sortDirection: $sortDirection
    ) {
      logs {
        id
        userId
        action
        module
        details
        ipAddress
        userAgent
        createdAt
        updatedAt
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
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        currentPage
        totalPages
      }
    }
  }
`;

export const GET_AUDIT_METRICS_QUERY: DocumentNode = gql`
  query AuditMetrics {
    auditMetrics {
      totalAudits
      issuesFound
      openFindings
      complianceRate
    }
  }
`;
