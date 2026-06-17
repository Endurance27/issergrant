import { useQuery } from '@apollo/client/react';
import { GET_AUDIT_METRICS_QUERY } from '../apollo/queries';
import type { AuditMetrics } from '../types/auditLog.types';

interface GetAuditMetricsResponse {
  auditMetrics: AuditMetrics;
}

export function useAuditMetrics() {
  const { data, loading, error, refetch } = useQuery<GetAuditMetricsResponse>(
    GET_AUDIT_METRICS_QUERY,
    { fetchPolicy: 'cache-and-network' },
  );

  return {
    metrics: data?.auditMetrics,
    loading,
    error,
    refetch,
  };
}
