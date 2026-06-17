import { useQuery } from '@apollo/client/react';
import { GET_AUDIT_LOGS_QUERY } from '../apollo/queries';
import type {
  AuditLogConnection,
  AuditLogFilter,
  AuditLogPaginationInput,
  SortDirection,
} from '../types/auditLog.types';

interface GetAuditLogsResponse {
  auditLogs: AuditLogConnection;
}

interface GetAuditLogsVariables {
  filter?: AuditLogFilter;
  pagination?: AuditLogPaginationInput;
  sortDirection?: SortDirection;
}

export function useAuditLogs(
  filter?: AuditLogFilter,
  pagination: AuditLogPaginationInput = { limit: 500, offset: 0 },
  sortDirection: SortDirection = 'DESC',
) {
  const { data, loading, error, refetch } = useQuery<
    GetAuditLogsResponse,
    GetAuditLogsVariables
  >(GET_AUDIT_LOGS_QUERY, {
    variables: { filter, pagination, sortDirection },
    fetchPolicy: 'cache-and-network',
  });

  return {
    logs: data?.auditLogs.logs ?? [],
    totalCount: data?.auditLogs.totalCount ?? 0,
    pageInfo: data?.auditLogs.pageInfo,
    loading,
    error,
    refetch,
  };
}
