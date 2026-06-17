export interface AuditLogUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: AuditLogUser | null;
}

export interface AuditLogFilter {
  action?: string;
  module?: string;
  fromDate?: string;
  toDate?: string;
  userId?: string;
}

export interface AuditLogPaginationInput {
  limit?: number;
  offset?: number;
}

export interface AuditLogPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
  currentPage?: number | null;
  totalPages?: number | null;
}

export interface AuditLogConnection {
  logs: AuditLog[];
  totalCount: number;
  pageInfo: AuditLogPageInfo;
}

export interface AuditMetrics {
  totalAudits: number;
  issuesFound: number;
  openFindings: number;
  complianceRate: number;
}

export type SortDirection = 'ASC' | 'DESC';
