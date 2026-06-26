export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
  JSON: { input: unknown; output: unknown; }
};

export type AccountSettings = {
  __typename?: 'AccountSettings';
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  lastLogin?: Maybe<Scalars['String']['output']>;
  theme: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  twoFactorEnabled: Scalars['Boolean']['output'];
  userId: Scalars['ID']['output'];
};

export type Account_Type =
  | 'admin'
  | 'director'
  | 'finance_officer'
  | 'guest'
  | 'researcher';

export type Admin = {
  __typename?: 'Admin';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type AdminDashboard = {
  __typename?: 'AdminDashboard';
  alerts: Array<DashboardAlert>;
  awardStatus: Array<DashboardChartData>;
  financialSummary: FinancialSummary;
  fundingByCategory: Array<DashboardChartData>;
  lastUpdated: Scalars['String']['output'];
  metrics: DashboardMetrics;
  proposalTrend: Array<DashboardChartData>;
  recentActivities: Array<RecentActivity>;
  systemHealth: SystemHealth;
  usersByRole: Array<DashboardChartData>;
};

export type AdminSignUpContent = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type AllSettings = {
  __typename?: 'AllSettings';
  application: ApplicationSettings;
  email: EmailSettings;
  featureFlags: Array<FeatureFlag>;
  notification: NotificationSettings;
  security: SecuritySettings;
  system: SystemSettings;
  updatedAt: Scalars['String']['output'];
};

export type AllocationInput = {
  category: Scalars['String']['input'];
  percentage: Scalars['Float']['input'];
};

export type AnalyticsData = {
  __typename?: 'AnalyticsData';
  awardAnalytics: AwardAnalytics;
  departmentAnalytics: Array<DepartmentAnalytics>;
  financialAnalytics: FinancialAnalytics;
  fundingAnalytics: FundingAnalytics;
  grantCallAnalytics: GrantCallAnalytics;
  proposalAnalytics: ProposalAnalytics;
  researcherAnalytics: ResearcherAnalytics;
  systemAnalytics: SystemAnalytics;
  userAnalytics: UserAnalytics;
};

export type AnalyticsFilterInput = {
  awardId?: InputMaybe<Scalars['String']['input']>;
  categories?: InputMaybe<Array<Scalars['String']['input']>>;
  dateRange?: InputMaybe<DateRangeInput>;
  department?: InputMaybe<Scalars['String']['input']>;
  departments?: InputMaybe<Array<Scalars['String']['input']>>;
  endDate: Scalars['String']['input'];
  fundingSource?: InputMaybe<Scalars['String']['input']>;
  fundingSources?: InputMaybe<Array<Scalars['String']['input']>>;
  institution?: InputMaybe<Scalars['String']['input']>;
  institutions?: InputMaybe<Array<Scalars['String']['input']>>;
  startDate: Scalars['String']['input'];
};

export type Application = {
  __typename?: 'Application';
  additionalInfoProvided: Scalars['Boolean']['output'];
  additionalNotes?: Maybe<Scalars['String']['output']>;
  applicantId: Scalars['ID']['output'];
  availableForInterview: Scalars['Boolean']['output'];
  budgetBreakdown?: Maybe<Array<BudgetItem>>;
  budgetJustification?: Maybe<Scalars['String']['output']>;
  conflictOfInterestDeclared: Scalars['Boolean']['output'];
  conflictOfInterestDetails?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  eligibilityResponses?: Maybe<Scalars['String']['output']>;
  ethicsApprovalNumber?: Maybe<Scalars['String']['output']>;
  ethicsApprovalRequired: Scalars['Boolean']['output'];
  ethicsApprovalStatus?: Maybe<Scalars['String']['output']>;
  expectedOutcomes?: Maybe<Scalars['String']['output']>;
  fundingCall?: Maybe<FundingCall>;
  fundingCallId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  interviewDates?: Maybe<Array<Scalars['String']['output']>>;
  legalComplianceConfirmed: Scalars['Boolean']['output'];
  meetsEligibility: Scalars['Boolean']['output'];
  projectDuration?: Maybe<Scalars['Int']['output']>;
  projectMethodology?: Maybe<Scalars['String']['output']>;
  projectObjectives?: Maybe<Scalars['String']['output']>;
  projectSummary?: Maybe<Scalars['String']['output']>;
  projectTitle: Scalars['String']['output'];
  requestedAmount?: Maybe<Scalars['Float']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
  status: ApplicationStatus;
  submissionDeadline: Scalars['String']['output'];
  submittedAt?: Maybe<Scalars['String']['output']>;
  supportingDocuments?: Maybe<Array<SupportingDocument>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ApplicationSettings = {
  __typename?: 'ApplicationSettings';
  defaultCurrency: Scalars['String']['output'];
  fiscalYearStart: Scalars['String']['output'];
  grantCallApplicationDeadline: Scalars['Int']['output'];
  milestoneReviewPeriod: Scalars['Int']['output'];
  proposalReviewPeriod: Scalars['Int']['output'];
  reportSubmissionDeadline: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ApplicationSettingsInput = {
  defaultCurrency?: InputMaybe<Scalars['String']['input']>;
  fiscalYearStart?: InputMaybe<Scalars['String']['input']>;
  grantCallApplicationDeadline?: InputMaybe<Scalars['Int']['input']>;
  milestoneReviewPeriod?: InputMaybe<Scalars['Int']['input']>;
  proposalReviewPeriod?: InputMaybe<Scalars['Int']['input']>;
  reportSubmissionDeadline?: InputMaybe<Scalars['Int']['input']>;
};

export type ApplicationStatus =
  | 'approved'
  | 'draft'
  | 'rejected'
  | 'submitted'
  | 'under_review'
  | 'withdrawn';

export type ApproveFundingInput = {
  approvedAmount: Scalars['Float']['input'];
  fundingRequestId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type ApproveMilestoneInput = {
  approvalNotes?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type ApproveProposalInput = {
  comment: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  reviewerNotes?: InputMaybe<Scalars['String']['input']>;
};

export type ApproveReportInput = {
  approvalNotes?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type ApproveTransactionInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};

export type AssignGuestToFundingCallInput = {
  fundingCallId: Scalars['ID']['input'];
  guestId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type AssignGuestToProposalInput = {
  guestId: Scalars['ID']['input'];
  proposalId: Scalars['ID']['input'];
  roleDescription?: InputMaybe<Scalars['String']['input']>;
};

export type AssignReviewersInput = {
  proposalId: Scalars['ID']['input'];
  reviewerIds: Array<Scalars['ID']['input']>;
};

export type AssignRoleInput = {
  role: UserRole;
  userId: Scalars['ID']['input'];
};

export type AssignmentRole =
  | 'contributor'
  | 'lead'
  | 'reviewer';

export type AssignmentType =
  | 'milestone'
  | 'project'
  | 'proposal'
  | 'report';

export type Attachment = {
  __typename?: 'Attachment';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  uploadedAt: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type AttachmentPayload = {
  __typename?: 'AttachmentPayload';
  attachment?: Maybe<Attachment>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  details?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  module: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  userAgent?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
};

export type AuditLogConnection = {
  __typename?: 'AuditLogConnection';
  logs: Array<AuditLog>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AuditLogFilterInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  fromDate?: InputMaybe<Scalars['String']['input']>;
  module?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type AuditLogPaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type AuditMetrics = {
  __typename?: 'AuditMetrics';
  complianceRate: Scalars['Float']['output'];
  issuesFound: Scalars['Int']['output'];
  openFindings: Scalars['Int']['output'];
  totalAudits: Scalars['Int']['output'];
};

export type AuthUser = {
  __typename?: 'AuthUser';
  accessToken?: Maybe<Scalars['String']['output']>;
  account_type?: Maybe<Account_Type>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  user?: Maybe<User>;
};

export type Award = {
  __typename?: 'Award';
  allocations?: Maybe<Array<FundingAllocation>>;
  awardedAmount: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: User;
  description?: Maybe<Scalars['String']['output']>;
  disbursementPercentage: Scalars['Float']['output'];
  disbursements?: Maybe<Array<FundingDisbursement>>;
  endDate: Scalars['String']['output'];
  fundingRequests?: Maybe<Array<FundingRequest>>;
  id: Scalars['ID']['output'];
  proposal: Proposal;
  remainingAmount: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
  status: AwardStatus;
  updatedAt: Scalars['String']['output'];
  utilizedAmount: Scalars['Float']['output'];
};

export type AwardAnalytics = {
  __typename?: 'AwardAnalytics';
  activeAwards: Scalars['Int']['output'];
  avgAwardSize: Scalars['Float']['output'];
  completedAwards: Scalars['Int']['output'];
  disbursementRate: Scalars['Float']['output'];
  pendingAwards: Scalars['Int']['output'];
  totalAwardAmount: Scalars['Float']['output'];
  totalAwards: Scalars['Int']['output'];
  totalDisbursedAmount: Scalars['Float']['output'];
};

export type AwardConnection = {
  __typename?: 'AwardConnection';
  edges: Array<AwardEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AwardEdge = {
  __typename?: 'AwardEdge';
  cursor: Scalars['String']['output'];
  node: Award;
};

export type AwardFilterInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  departments?: InputMaybe<Array<Scalars['String']['input']>>;
  proposalId?: InputMaybe<Scalars['ID']['input']>;
  researcherId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<AwardStatus>>;
};

export type AwardPayload = {
  __typename?: 'AwardPayload';
  award?: Maybe<Award>;
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type AwardSortField =
  | 'AWARDED_AMOUNT'
  | 'AWARDED_DATE'
  | 'CREATED_AT'
  | 'RESEARCHER'
  | 'STATUS'
  | 'TITLE';

export type AwardSortInput = {
  direction: SortDirection;
  field: AwardSortField;
};

export type AwardStats = {
  __typename?: 'AwardStats';
  active: Scalars['Int']['output'];
  completed: Scalars['Int']['output'];
  suspended: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalAwardedAmount: Scalars['Float']['output'];
  totalDisbursedAmount: Scalars['Float']['output'];
  totalRemainingAmount: Scalars['Float']['output'];
};

export type AwardStatus =
  | 'ACTIVE'
  | 'APPROVED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'PENDING'
  | 'SUSPENDED';

export type Budget = {
  __typename?: 'Budget';
  allocatedAmount: Scalars['Float']['output'];
  allocatedBudget: Scalars['Float']['output'];
  approvedBy?: Maybe<Scalars['String']['output']>;
  awardId: Scalars['ID']['output'];
  costCenter: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: User;
  description: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  expendedAmount: Scalars['Float']['output'];
  fiscalYear: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  remainingAmount: Scalars['Float']['output'];
  remainingBudget: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
  status: BudgetStatus;
  totalAmount: Scalars['Float']['output'];
  totalBudget: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  utilizationPercentage: Scalars['Float']['output'];
  utilizedBudget: Scalars['Float']['output'];
};

export type BudgetAnalytics = {
  __typename?: 'BudgetAnalytics';
  allocatedBudget: Scalars['Float']['output'];
  department: Scalars['String']['output'];
  utilizationPercentage: Scalars['Float']['output'];
  utilizedBudget: Scalars['Float']['output'];
};

export type BudgetCategory = {
  __typename?: 'BudgetCategory';
  color: Scalars['String']['output'];
  label: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
};

export type BudgetConnection = {
  __typename?: 'BudgetConnection';
  edges: Array<BudgetEdge>;
  nodes: Array<Budget>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type BudgetEdge = {
  __typename?: 'BudgetEdge';
  cursor: Scalars['String']['output'];
  node: Budget;
};

export type BudgetFilterInput = {
  costCenter?: InputMaybe<Scalars['String']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<BudgetStatus>>;
};

export type BudgetItem = {
  __typename?: 'BudgetItem';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type BudgetItemInput = {
  amount: Scalars['Float']['input'];
  category: Scalars['String']['input'];
  description: Scalars['String']['input'];
};

export type BudgetStatus =
  | 'ACTIVE'
  | 'APPROVED'
  | 'CLOSED'
  | 'DRAFT'
  | 'EXHAUSTED'
  | 'PENDING_APPROVAL'
  | 'REJECTED';

export type BulkCreateUserError = {
  __typename?: 'BulkCreateUserError';
  email?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  row: Scalars['Int']['output'];
};

export type BulkCreateUsersInput = {
  users: Array<CreateUserInput>;
};

export type BulkCreateUsersResult = {
  __typename?: 'BulkCreateUsersResult';
  created: Scalars['Int']['output'];
  errors: Array<BulkCreateUserError>;
  failed: Scalars['Int']['output'];
};

export type BulkNotificationResult = {
  __typename?: 'BulkNotificationResult';
  failed: Scalars['Int']['output'];
  processed: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

export type BulkProposalActionInput = {
  action: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  proposalIds: Array<Scalars['ID']['input']>;
};

export type BulkProposalActionResult = {
  __typename?: 'BulkProposalActionResult';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  failed: Scalars['Int']['output'];
  processed: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

export type CalendarAttendee = {
  __typename?: 'CalendarAttendee';
  id: Scalars['ID']['output'];
  respondedAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  user: User;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  attendees?: Maybe<Array<CalendarAttendee>>;
  award?: Maybe<Award>;
  createdAt: Scalars['String']['output'];
  createdBy: User;
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  meetingUrl?: Maybe<Scalars['String']['output']>;
  reminder?: Maybe<Scalars['Boolean']['output']>;
  reminderMinutes?: Maybe<Scalars['Int']['output']>;
  startDate: Scalars['String']['output'];
  status: EventStatus;
  title: Scalars['String']['output'];
  type: EventType;
  updatedAt: Scalars['String']['output'];
};

export type CalendarEventConnection = {
  __typename?: 'CalendarEventConnection';
  edges: Array<CalendarEventEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CalendarEventEdge = {
  __typename?: 'CalendarEventEdge';
  cursor: Scalars['String']['output'];
  node: CalendarEvent;
};

export type CalendarEventFilterInput = {
  attendeeId?: InputMaybe<Scalars['ID']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<EventStatus>>;
  types?: InputMaybe<Array<EventType>>;
};

export type CalendarEventPayload = {
  __typename?: 'CalendarEventPayload';
  event?: Maybe<CalendarEvent>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CalendarStats = {
  __typename?: 'CalendarStats';
  thisMonthEvents: Scalars['Int']['output'];
  thisWeekEvents: Scalars['Int']['output'];
  todayEvents: Scalars['Int']['output'];
  upcomingEvents: Scalars['Int']['output'];
};

export type CalendarView =
  | 'DAILY'
  | 'MONTHLY'
  | 'WEEKLY';

export type CategoryCount = {
  __typename?: 'CategoryCount';
  category: NotificationCategory;
  count: Scalars['Int']['output'];
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type Collaborator = {
  __typename?: 'Collaborator';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  joinedAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  author: Scalars['String']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type CommentPayload = {
  __typename?: 'CommentPayload';
  comment?: Maybe<Comment>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CompleteMilestoneInput = {
  completionNotes?: InputMaybe<Scalars['String']['input']>;
  evidence?: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
};

export type ConfigureReminderInput = {
  enabled: Scalars['Boolean']['input'];
  eventId: Scalars['ID']['input'];
  minutesBefore?: InputMaybe<Scalars['Int']['input']>;
};

export type CostCenter = {
  __typename?: 'CostCenter';
  budget?: Maybe<Scalars['Float']['output']>;
  code: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CreateApplicationInput = {
  applicantId: Scalars['ID']['input'];
  fundingCallId: Scalars['ID']['input'];
  projectTitle: Scalars['String']['input'];
  submissionDeadline: Scalars['String']['input'];
};

export type CreateAwardInput = {
  awardedAmount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['String']['input'];
  proposalId: Scalars['ID']['input'];
  startDate: Scalars['String']['input'];
};

export type CreateBudgetInput = {
  awardId: Scalars['ID']['input'];
  costCenter: Scalars['String']['input'];
  description: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  fiscalYear: Scalars['String']['input'];
  name: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  totalAmount: Scalars['Float']['input'];
  totalBudget: Scalars['Float']['input'];
};

export type CreateCalendarEventInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  label: Scalars['String']['input'];
  relatedEntityId?: InputMaybe<Scalars['String']['input']>;
  relatedEntityType?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type CreateEventInput = {
  attendeeIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  awardId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['String']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  reminder?: InputMaybe<Scalars['Boolean']['input']>;
  reminderMinutes?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: EventType;
};

export type CreateFinanceEventInput = {
  attendees?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate: Scalars['String']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  reminderDays?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  type: FinanceEventType;
};

export type CreateFundingAllocationInput = {
  amount: Scalars['Float']['input'];
  awardId: Scalars['ID']['input'];
  category: Scalars['String']['input'];
};

export type CreateFundingCallInput = {
  allowsMultipleApplications: MultipleApplicationsAllowed;
  createdBy: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  eligibility?: InputMaybe<Array<Scalars['String']['input']>>;
  funder: Scalars['String']['input'];
  hasMinMaxAward: Scalars['Boolean']['input'];
  maximumAward: Scalars['Float']['input'];
  minimumAward?: InputMaybe<Scalars['Float']['input']>;
  openDate: Scalars['String']['input'];
  originalCallLink?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Scalars['String']['input']>;
  totalAvailable: Scalars['Float']['input'];
};

export type CreateGuestInput = {
  assignedResearcherId: Scalars['ID']['input'];
  assignmentType?: InputMaybe<AssignmentType>;
  department?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phoneContact?: InputMaybe<Scalars['String']['input']>;
  resourceId?: InputMaybe<Scalars['String']['input']>;
  resourceTitle?: InputMaybe<Scalars['String']['input']>;
  staffId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMilestoneInput = {
  awardId: Scalars['ID']['input'];
  deliverables?: InputMaybe<Array<Scalars['String']['input']>>;
  description: Scalars['String']['input'];
  dueDate: Scalars['String']['input'];
  projectId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateProposalDraftInput = {
  abstract?: InputMaybe<Scalars['String']['input']>;
  fundingCallId: Scalars['ID']['input'];
  requestedAmount?: InputMaybe<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
};

export type CreateProposalInput = {
  abstract: Scalars['String']['input'];
  coPiIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  fundingCallId: Scalars['ID']['input'];
  requestedAmount?: InputMaybe<Scalars['Float']['input']>;
  title: Scalars['String']['input'];
  userID: Scalars['ID']['input'];
};

export type CreateReportDraftInput = {
  projectId: Scalars['String']['input'];
  projectTitle: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateReportInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateUserContent = {
  account_type: Account_Type;
  department?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  phone_contact?: InputMaybe<Scalars['String']['input']>;
  staffid?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserInput = {
  department?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  phoneContact?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
  staffId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserResult = {
  __typename?: 'CreateUserResult';
  temporaryPassword: Scalars['String']['output'];
  user: User;
};

export type CursorPaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type DashboardAlert = {
  __typename?: 'DashboardAlert';
  action?: Maybe<Scalars['String']['output']>;
  actionUrl?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  severity: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type DashboardChartData = {
  __typename?: 'DashboardChartData';
  color?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
  value: Scalars['Int']['output'];
};

export type DashboardEvent = {
  __typename?: 'DashboardEvent';
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  urgency: Scalars['String']['output'];
};

export type DashboardMetrics = {
  __typename?: 'DashboardMetrics';
  activeAdministrators: Scalars['Int']['output'];
  activeAwards: Scalars['Int']['output'];
  activeFinanceOfficers: Scalars['Int']['output'];
  activeGrantCalls: Scalars['Int']['output'];
  activeGuests: Scalars['Int']['output'];
  activeMilestones: Scalars['Int']['output'];
  activeResearchers: Scalars['Int']['output'];
  approvedProposals: Scalars['Int']['output'];
  approvedReports: Scalars['Int']['output'];
  budgetUtilization: Scalars['Float']['output'];
  closedGrantCalls: Scalars['Int']['output'];
  completedMilestones: Scalars['Int']['output'];
  draftGrantCalls: Scalars['Int']['output'];
  fundedProposals: Scalars['Int']['output'];
  lastBackupTime?: Maybe<Scalars['String']['output']>;
  maintenanceMode: Scalars['Boolean']['output'];
  overdueMilestones: Scalars['Int']['output'];
  pendingProposals: Scalars['Int']['output'];
  pendingReports: Scalars['Int']['output'];
  pendingTransactions: Scalars['Int']['output'];
  proposalApprovalRate: Scalars['Float']['output'];
  rejectedProposals: Scalars['Int']['output'];
  remainingBudget: Scalars['Float']['output'];
  submittedReports: Scalars['Int']['output'];
  systemHealthStatus: Scalars['String']['output'];
  totalAwardedAmount: Scalars['Float']['output'];
  totalDisbursedAmount: Scalars['Float']['output'];
  totalExpenditure: Scalars['Float']['output'];
  totalGrantCalls: Scalars['Int']['output'];
  totalNotifications: Scalars['Int']['output'];
  totalProposals: Scalars['Int']['output'];
  totalRemainingAmount: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
  totalUsers: Scalars['Int']['output'];
  unreadNotifications: Scalars['Int']['output'];
  upcomingDeadlines: Scalars['Int']['output'];
  upcomingEvents: Scalars['Int']['output'];
};

export type DashboardStats = {
  __typename?: 'DashboardStats';
  activeAwards: Scalars['Int']['output'];
  activeGrantCalls: Scalars['Int']['output'];
  activeProposals: Scalars['Int']['output'];
  activeUsers: Scalars['Int']['output'];
  approvedProposals: Scalars['Int']['output'];
  completedMilestones: Scalars['Int']['output'];
  disbursedAmount: Scalars['Float']['output'];
  openGrantCalls: Scalars['Int']['output'];
  overdueMilestones: Scalars['Int']['output'];
  pendingMilestones: Scalars['Int']['output'];
  pendingProposals: Scalars['Int']['output'];
  recentApplications: Scalars['Int']['output'];
  rejectedProposals: Scalars['Int']['output'];
  totalBudget: Scalars['Float']['output'];
  totalProposals: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
  unreadNotifications: Scalars['Int']['output'];
  usersByRole: Array<UserRoleCount>;
};

export type DateRangeFilterInput = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type DateRangeInput = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type DepartmentAnalytics = {
  __typename?: 'DepartmentAnalytics';
  activeResearchers: Scalars['Int']['output'];
  department: Scalars['String']['output'];
  proposalsApproved: Scalars['Int']['output'];
  proposalsSubmitted: Scalars['Int']['output'];
  totalFunding: Scalars['Float']['output'];
};

export type DepartmentMetric = {
  __typename?: 'DepartmentMetric';
  activeResearchers: Scalars['Int']['output'];
  department: Scalars['String']['output'];
  proposalsApproved: Scalars['Int']['output'];
  proposalsSubmitted: Scalars['Int']['output'];
  totalFunding: Scalars['Float']['output'];
};

export type DisbursementMetrics = {
  __typename?: 'DisbursementMetrics';
  disbursementRate: Scalars['Float']['output'];
  pendingDisbursement: Scalars['Float']['output'];
  totalDisbursed: Scalars['Float']['output'];
};

export type DisbursementRecord = {
  __typename?: 'DisbursementRecord';
  amount: Scalars['Float']['output'];
  awardId: Scalars['ID']['output'];
  date: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  requestedBy: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type DocumentType =
  | 'cv'
  | 'ethics_approval'
  | 'letter_of_support'
  | 'other'
  | 'registration';

export type EligibilityResponseInput = {
  question: Scalars['String']['input'];
  response: Scalars['Boolean']['input'];
};

export type EmailSettings = {
  __typename?: 'EmailSettings';
  enableSSL: Scalars['Boolean']['output'];
  fromEmail: Scalars['String']['output'];
  fromName: Scalars['String']['output'];
  replyToEmail: Scalars['String']['output'];
  smtpPort: Scalars['Int']['output'];
  smtpServer: Scalars['String']['output'];
  smtpUsername: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type EmailSettingsInput = {
  enableSSL?: InputMaybe<Scalars['Boolean']['input']>;
  fromEmail?: InputMaybe<Scalars['String']['input']>;
  fromName?: InputMaybe<Scalars['String']['input']>;
  replyToEmail?: InputMaybe<Scalars['String']['input']>;
  smtpPort?: InputMaybe<Scalars['Int']['input']>;
  smtpServer?: InputMaybe<Scalars['String']['input']>;
  smtpUsername?: InputMaybe<Scalars['String']['input']>;
};

export type EventPayload = {
  __typename?: 'EventPayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  event?: Maybe<CalendarEvent>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type EventStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'SCHEDULED';

export type EventType =
  | 'DEADLINE'
  | 'GRANT_CALL_CLOSING'
  | 'GRANT_CALL_OPENING'
  | 'MEETING'
  | 'MILESTONE_DUE'
  | 'OTHER'
  | 'REPORT_DUE'
  | 'REVIEW_SESSION';

export type ExportReportInput = {
  format: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type ExportResult = {
  __typename?: 'ExportResult';
  format: Scalars['String']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type FeatureFlag = {
  __typename?: 'FeatureFlag';
  createdAt: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  rolloutPercentage: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FeatureFlagInput = {
  enabled: Scalars['Boolean']['input'];
  key: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  rolloutPercentage?: InputMaybe<Scalars['Int']['input']>;
};

export type FinanceDashboard = {
  __typename?: 'FinanceDashboard';
  activeAwards: Scalars['Int']['output'];
  approvalsPending: Scalars['Int']['output'];
  auditCompliance: Scalars['Float']['output'];
  budgetUtilizationPercentage: Scalars['Float']['output'];
  fundingTrends: Array<FundingTrendSummary>;
  monthlyExpenditure: Scalars['Float']['output'];
  pendingFundingRequests: Scalars['Int']['output'];
  recentTransactions: Array<RecentTransaction>;
  remainingBudget: Scalars['Float']['output'];
  reportsInProgress: Scalars['Int']['output'];
  topAwards: Array<TopAward>;
  totalExpenditure: Scalars['Float']['output'];
  totalFunding: Scalars['Float']['output'];
  unreadNotifications: Scalars['Int']['output'];
  upcomingDeadlines: Scalars['Int']['output'];
  upcomingEvents: Array<DashboardEvent>;
};

export type FinanceEvent = {
  __typename?: 'FinanceEvent';
  attendees?: Maybe<Array<Scalars['String']['output']>>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  relatedResourceId?: Maybe<Scalars['String']['output']>;
  relatedResourceType?: Maybe<Scalars['String']['output']>;
  reminderDays: Scalars['Int']['output'];
  reminderSent: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: FinanceEventType;
  updatedAt: Scalars['String']['output'];
};

export type FinanceEventConnection = {
  __typename?: 'FinanceEventConnection';
  nodes: Array<FinanceEvent>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type FinanceEventType =
  | 'AUDIT_SCHEDULE'
  | 'BUDGET_REVIEW'
  | 'COMPLIANCE_SCHEDULE'
  | 'FINANCIAL_DEADLINE'
  | 'FUND_DISBURSEMENT'
  | 'MEETING'
  | 'REPORTING_DEADLINE';

export type FinanceNotification = {
  __typename?: 'FinanceNotification';
  category: NotificationCategory;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isRead: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  readAt?: Maybe<Scalars['String']['output']>;
  relatedResourceId?: Maybe<Scalars['String']['output']>;
  relatedResourceType?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type FinanceOfficerProfile = {
  __typename?: 'FinanceOfficerProfile';
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  department?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type FinanceReport = {
  __typename?: 'FinanceReport';
  approvalDate?: Maybe<Scalars['String']['output']>;
  approvedBy?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  fileSize?: Maybe<Scalars['String']['output']>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  generatedBy: Scalars['String']['output'];
  generatedFor?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  relatedAwardId?: Maybe<Scalars['String']['output']>;
  reportType: FinanceReportType;
  status: FinanceReportStatus;
  submittedDate?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type FinanceReportConnection = {
  __typename?: 'FinanceReportConnection';
  nodes: Array<FinanceReport>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type FinanceReportStats = {
  __typename?: 'FinanceReportStats';
  approved: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
  totalReports: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
};

export type FinanceReportStatus =
  | 'APPROVED'
  | 'DRAFT'
  | 'REJECTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW';

export type FinanceReportType =
  | 'AUDIT_REPORT'
  | 'AWARD_REPORT'
  | 'BUDGET_REPORT'
  | 'COMPLIANCE_REPORT'
  | 'EXPENDITURE_REPORT'
  | 'FINANCIAL_REPORT';

export type FinancialAnalytics = {
  __typename?: 'FinancialAnalytics';
  avgMonthlyExpenditure: Scalars['Float']['output'];
  largestExpenseMonth?: Maybe<Scalars['String']['output']>;
  monthlyExpenditure: Array<MonthlyMetric>;
  monthlyRevenue: Array<MonthlyMetric>;
  netBalance: Scalars['Float']['output'];
  totalExpenditure: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type FinancialOverview = {
  __typename?: 'FinancialOverview';
  expenditureGrowth: Scalars['Float']['output'];
  remainingFunding: Scalars['Float']['output'];
  totalFunding: Scalars['Float']['output'];
  utilizationPercentage: Scalars['Float']['output'];
  utilizedFunding: Scalars['Float']['output'];
};

export type FinancialPayload = {
  __typename?: 'FinancialPayload';
  budget?: Maybe<Budget>;
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  transaction?: Maybe<Transaction>;
};

export type FinancialPreferences = {
  __typename?: 'FinancialPreferences';
  autoApprovalLimit: Scalars['Float']['output'];
  defaultCurrency: Scalars['String']['output'];
  defaultFiscalYear: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  requiresApprovalAbove: Scalars['Float']['output'];
  userId: Scalars['ID']['output'];
};

export type FinancialSortField =
  | 'AMOUNT'
  | 'CREATED_AT'
  | 'DATE'
  | 'PROJECT'
  | 'STATUS'
  | 'TYPE';

export type FinancialSortInput = {
  direction: SortDirection;
  field: FinancialSortField;
};

export type FinancialSummary = {
  __typename?: 'FinancialSummary';
  activeAwards: Scalars['Int']['output'];
  activeAwardsCount: Scalars['Int']['output'];
  monthlyExpenditure: Array<MonthlyData>;
  monthlyRevenue: Array<MonthlyData>;
  netBalance: Scalars['Float']['output'];
  pendingApprovals: Scalars['Int']['output'];
  pendingTransactionsCount: Scalars['Int']['output'];
  remainingBudget: Scalars['Float']['output'];
  totalBudget: Scalars['Float']['output'];
  totalExpenditure: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
  utilizationPercentage: Scalars['Float']['output'];
  utilizedBudget: Scalars['Float']['output'];
};

export type ForgotPasswordContent = {
  email: Scalars['String']['input'];
};

export type FundingAllocation = {
  __typename?: 'FundingAllocation';
  allocatedDate: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  awardId: Scalars['ID']['output'];
  category: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  percentage: Scalars['Float']['output'];
  status: Scalars['String']['output'];
};

export type FundingAnalytics = {
  __typename?: 'FundingAnalytics';
  activeAwards: Scalars['Int']['output'];
  completedAwards: Scalars['Int']['output'];
  pendingApproval: Scalars['Float']['output'];
  remainingFunding: Scalars['Float']['output'];
  totalFunding: Scalars['Float']['output'];
  utilizationPercentage: Scalars['Float']['output'];
  utilizedFunding: Scalars['Float']['output'];
};

export type FundingCall = {
  __typename?: 'FundingCall';
  allowsMultipleApplications: MultipleApplicationsAllowed;
  collaborators?: Maybe<Array<FundingCallCollaborator>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  eligibility?: Maybe<Array<Scalars['String']['output']>>;
  funder: Scalars['String']['output'];
  hasMinMaxAward: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  maximumAward: Scalars['Float']['output'];
  minimumAward?: Maybe<Scalars['Float']['output']>;
  openDate: Scalars['String']['output'];
  originalCallLink?: Maybe<Scalars['String']['output']>;
  theme?: Maybe<Scalars['String']['output']>;
  totalAvailable: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type FundingCallCollaborator = {
  __typename?: 'FundingCallCollaborator';
  assignedBy: Scalars['ID']['output'];
  assigner?: Maybe<User>;
  createdAt: Scalars['String']['output'];
  fundingCall?: Maybe<FundingCall>;
  fundingCallId: Scalars['ID']['output'];
  guest?: Maybe<User>;
  guestId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type FundingCategoryData = {
  __typename?: 'FundingCategoryData';
  color?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
  value: Scalars['Float']['output'];
};

export type FundingDisbursement = {
  __typename?: 'FundingDisbursement';
  amount: Scalars['Float']['output'];
  approvedBy: User;
  awardId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  date: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: FundingStatus;
};

export type FundingPayload = {
  __typename?: 'FundingPayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  fundingRequest?: Maybe<FundingRequest>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type FundingRequest = {
  __typename?: 'FundingRequest';
  approvedAmount?: Maybe<Scalars['Float']['output']>;
  approvedBy?: Maybe<User>;
  awardId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reason: Scalars['String']['output'];
  requestedAmount: Scalars['Float']['output'];
  requestedBy: User;
  status: FundingStatus;
  updatedAt: Scalars['String']['output'];
};

export type FundingStats = {
  __typename?: 'FundingStats';
  activeAwards: Scalars['Int']['output'];
  completedAwards: Scalars['Int']['output'];
  remainingFunding: Scalars['Float']['output'];
  totalAwarded: Scalars['Float']['output'];
  totalDisbursed: Scalars['Float']['output'];
};

export type FundingStatus =
  | 'APPROVED'
  | 'DISBURSED'
  | 'PENDING'
  | 'REJECTED'
  | 'REQUESTED';

export type FundingTrend = {
  __typename?: 'FundingTrend';
  balance: Scalars['Float']['output'];
  expenditure: Scalars['Float']['output'];
  fundingReceived: Scalars['Float']['output'];
  month: Scalars['String']['output'];
};

export type FundingTrendSummary = {
  __typename?: 'FundingTrendSummary';
  amount: Scalars['Float']['output'];
  change: Scalars['Float']['output'];
  month: Scalars['String']['output'];
};

export type GenerateReportInput = {
  awardId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['String']['input'];
  generatedFor: Scalars['String']['input'];
  period: ReportPeriod;
  reportType: FinanceReportType;
  startDate: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: ReportType;
};

export type GenericPayload = {
  __typename?: 'GenericPayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetApplicationFilter = {
  applicantId?: InputMaybe<Scalars['ID']['input']>;
  fundingCallId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<ApplicationStatus>;
};

export type GetAwardsInput = {
  filter?: InputMaybe<AwardFilterInput>;
  pagination?: InputMaybe<CursorPaginationInput>;
  sorting?: InputMaybe<AwardSortInput>;
};

export type GetBudgetsInput = {
  filter?: InputMaybe<BudgetFilterInput>;
  pagination?: InputMaybe<CursorPaginationInput>;
  sorting?: InputMaybe<FinancialSortInput>;
};

export type GetCalendarEventsInput = {
  filter?: InputMaybe<CalendarEventFilterInput>;
  pagination?: InputMaybe<CursorPaginationInput>;
};

export type GetFundingCallFilter = {
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  funder?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  theme?: InputMaybe<Scalars['String']['input']>;
};

export type GetMilestonesInput = {
  filter?: InputMaybe<MilestoneFilterInput>;
  pagination?: InputMaybe<CursorPaginationInput>;
  sorting?: InputMaybe<MilestoneSortInput>;
};

export type GetNotificationsInput = {
  filter?: InputMaybe<NotificationFilterInput>;
  pagination?: InputMaybe<CursorPaginationInput>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type GetProposalsInput = {
  filter?: InputMaybe<ProposalFilterInput>;
  pagination?: InputMaybe<CursorPaginationInput>;
  sorting?: InputMaybe<ProposalSortInput>;
};

export type GetReportsInput = {
  filter?: InputMaybe<ReportFilterInput>;
  pagination?: InputMaybe<CursorPaginationInput>;
  sorting?: InputMaybe<ReportSortInput>;
};

export type GetTransactionsInput = {
  filter?: InputMaybe<TransactionFilterInput>;
  pagination?: InputMaybe<CursorPaginationInput>;
  sorting?: InputMaybe<FinancialSortInput>;
};

export type GetUsersInput = {
  filter?: InputMaybe<UserFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sorting?: InputMaybe<SortingInput>;
};

export type GrantCallAnalytics = {
  __typename?: 'GrantCallAnalytics';
  avgApplicationsPerCall: Scalars['Int']['output'];
  closedGrantCalls: Scalars['Int']['output'];
  openGrantCalls: Scalars['Int']['output'];
  totalApplications: Scalars['Int']['output'];
  totalGrantCalls: Scalars['Int']['output'];
};

export type GrantCallBookmark = {
  __typename?: 'GrantCallBookmark';
  bookmarkedAt: Scalars['String']['output'];
  fundingCallId: Scalars['ID']['output'];
  fundingCallTitle: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  userID: Scalars['ID']['output'];
};

export type GrantCallBookmarkPayload = {
  __typename?: 'GrantCallBookmarkPayload';
  bookmark?: Maybe<GrantCallBookmark>;
  grantCall?: Maybe<GuestGrantCall>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GrantCallStats = {
  __typename?: 'GrantCallStats';
  closed: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  open: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type GrowthData = {
  __typename?: 'GrowthData';
  month: Scalars['String']['output'];
  newUsers: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type GuestDashboard = {
  __typename?: 'GuestDashboard';
  recentProposals: Array<Proposal>;
  stats: DashboardStats;
  upcomingMilestones: Array<Milestone>;
};

export type GuestGrantCall = {
  __typename?: 'GuestGrantCall';
  applicationCount: Scalars['Int']['output'];
  bookmarkNotes?: Maybe<Scalars['String']['output']>;
  category: Scalars['String']['output'];
  deadline: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  eligibility?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isBookmarked: Scalars['Boolean']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  totalBudget: Scalars['Float']['output'];
};

export type GuestGrantCallConnection = {
  __typename?: 'GuestGrantCallConnection';
  edges: Array<GuestGrantCallEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GuestGrantCallEdge = {
  __typename?: 'GuestGrantCallEdge';
  cursor: Scalars['String']['output'];
  node: GuestGrantCall;
};

export type GuestMilestoneStats = {
  __typename?: 'GuestMilestoneStats';
  approved: Scalars['Int']['output'];
  completed: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  locked: Scalars['Int']['output'];
  overdue: Scalars['Int']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
};

export type GuestProfile = {
  __typename?: 'GuestProfile';
  bio?: Maybe<Scalars['String']['output']>;
  department: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  joinedAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
  officeLocation?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  photoUrl?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  status: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type GuestProfilePayload = {
  __typename?: 'GuestProfilePayload';
  message: Scalars['String']['output'];
  profile?: Maybe<GuestProfile>;
  success: Scalars['Boolean']['output'];
};

export type GuestProposalStats = {
  __typename?: 'GuestProposalStats';
  approved: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  inProgress: Scalars['Int']['output'];
  pendingReview: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type GuestReportStats = {
  __typename?: 'GuestReportStats';
  approved: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
};

export type LoginActivityData = {
  __typename?: 'LoginActivityData';
  date: Scalars['String']['output'];
  logins: Scalars['Int']['output'];
};

export type Milestone = {
  __typename?: 'Milestone';
  approvalNotes?: Maybe<Scalars['String']['output']>;
  approvedBy?: Maybe<User>;
  assignedTo?: Maybe<User>;
  award: Award;
  completedBy?: Maybe<User>;
  completionNotes?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  deliverables?: Maybe<Array<Scalars['String']['output']>>;
  description: Scalars['String']['output'];
  dueDate: Scalars['String']['output'];
  evidence?: Maybe<Array<MilestoneEvidence>>;
  id: Scalars['ID']['output'];
  progress: MilestoneProgress;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status: MilestoneStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type MilestoneConnection = {
  __typename?: 'MilestoneConnection';
  edges: Array<MilestoneEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MilestoneEdge = {
  __typename?: 'MilestoneEdge';
  cursor: Scalars['String']['output'];
  node: Milestone;
};

export type MilestoneEvidence = {
  __typename?: 'MilestoneEvidence';
  description?: Maybe<Scalars['String']['output']>;
  documentUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  uploadedAt: Scalars['String']['output'];
  uploadedBy: User;
};

export type MilestoneFilterInput = {
  awardId?: InputMaybe<Scalars['ID']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  projectId?: InputMaybe<Scalars['ID']['input']>;
  researchers?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<MilestoneStatus>>;
};

export type MilestonePayload = {
  __typename?: 'MilestonePayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  milestone?: Maybe<Milestone>;
  success: Scalars['Boolean']['output'];
};

export type MilestoneProgress = {
  __typename?: 'MilestoneProgress';
  completedDeliverables: Scalars['Int']['output'];
  lastUpdated: Scalars['String']['output'];
  percentComplete: Scalars['Float']['output'];
  totalDeliverables: Scalars['Int']['output'];
};

export type MilestoneSortField =
  | 'CREATED_AT'
  | 'DUE_DATE'
  | 'PROJECT'
  | 'STATUS'
  | 'TITLE';

export type MilestoneSortInput = {
  direction: SortDirection;
  field: MilestoneSortField;
};

export type MilestoneStats = {
  __typename?: 'MilestoneStats';
  approved: Scalars['Int']['output'];
  completed: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  dueThisMonth: Scalars['Int']['output'];
  inProgress: Scalars['Int']['output'];
  locked: Scalars['Int']['output'];
  missed: Scalars['Int']['output'];
  overdue: Scalars['Int']['output'];
  overdueCount: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
};

export type MilestoneStatus =
  | 'CANCELLED'
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'MISSED'
  | 'OVERDUE'
  | 'PENDING';

export type ModuleUsage = {
  __typename?: 'ModuleUsage';
  activeUsers: Scalars['Int']['output'];
  module: Scalars['String']['output'];
  usageCount: Scalars['Int']['output'];
};

export type MonthlyApplicationStat = {
  __typename?: 'MonthlyApplicationStat';
  approved: Scalars['Int']['output'];
  month: Scalars['String']['output'];
  rejected: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type MonthlyData = {
  __typename?: 'MonthlyData';
  amount: Scalars['Float']['output'];
  month: Scalars['String']['output'];
};

export type MonthlyMetric = {
  __typename?: 'MonthlyMetric';
  amount: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
  month: Scalars['String']['output'];
};

export type MonthlyProposalStat = {
  __typename?: 'MonthlyProposalStat';
  approved: Scalars['Int']['output'];
  month: Scalars['String']['output'];
  rejected: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
};

export type MultipleApplicationsAllowed =
  | 'no'
  | 'yes';

export type Mutation = {
  __typename?: 'Mutation';
  activateUser?: Maybe<User>;
  addCollaborator: ProposalPayload;
  addMilestoneComment: CommentPayload;
  addProposalComment: CommentPayload;
  addReportComment: CommentPayload;
  adminSignUp?: Maybe<Scalars['Boolean']['output']>;
  approveBudget: FinancialPayload;
  approveDisbursement: Scalars['Boolean']['output'];
  approveFunding: FundingPayload;
  approveFundingRequest: Award;
  approveMilestone: MilestonePayload;
  approveProposal: ProposalPayload;
  approveReport: ReportPayload;
  approveTransaction: FinancialPayload;
  archiveNotification: NotificationPayload;
  archiveProposal: ProposalPayload;
  archiveReport: ReportPayload;
  assignGuestToFundingCall: FundingCallCollaborator;
  assignGuestToProposal: ProposalCollaborator;
  assignMilestone: MilestonePayload;
  assignReviewers: ProposalPayload;
  assignRole?: Maybe<User>;
  bookmarkGrantCall: GrantCallBookmarkPayload;
  bulkApproveProposals: BulkProposalActionResult;
  bulkCreateUsers: BulkCreateUsersResult;
  bulkRejectProposals: BulkProposalActionResult;
  cancelAward: AwardPayload;
  cancelEvent: EventPayload;
  cancelMilestone: MilestonePayload;
  changePassword: GenericPayload;
  closeBudget: FinancialPayload;
  completeMilestone: MilestonePayload;
  completeMilestoneTask: MilestonePayload;
  configureReminder: EventPayload;
  createApplication: Application;
  createAward: AwardPayload;
  createBudget: FinancialPayload;
  createCalendarEvent: CalendarEventPayload;
  createEvent: EventPayload;
  createFeatureFlag: FeatureFlag;
  createFinanceEvent: FinanceEvent;
  createFundingAllocation: FundingAllocation;
  createFundingCall: FundingCall;
  createGuest: CreateUserResult;
  createMilestone: MilestonePayload;
  createProposal: ProposalPayload;
  createProposalDraft: ProposalPayload;
  createReport: ReportPayload;
  createReportDraft: ReportPayload;
  createUser: CreateUserResult;
  deleteAllNotifications: Scalars['Boolean']['output'];
  deleteApplication: Scalars['Boolean']['output'];
  deleteCalendarEvent: Scalars['Boolean']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteFeatureFlag: Scalars['Boolean']['output'];
  deleteFinanceEvent: Scalars['Boolean']['output'];
  deleteFundingCall: Scalars['Boolean']['output'];
  deleteMilestone: Scalars['Boolean']['output'];
  deleteNotification: Scalars['Boolean']['output'];
  deleteReport: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  disable2FA: GenericPayload;
  disableMaintenanceMode: SettingsPayload;
  disableNotificationType: NotificationPayload;
  enable2FA: GenericPayload;
  enableMaintenanceMode: SettingsPayload;
  enableNotificationType: NotificationPayload;
  exportFinanceReport: Scalars['String']['output'];
  exportReport: ExportResult;
  exportSettings?: Maybe<Scalars['String']['output']>;
  forgotPassword: Scalars['Boolean']['output'];
  generateFinanceReport: FinanceReport;
  generateReport: ReportPayload;
  guestChangePassword: PasswordPayload;
  guestUpdateNotificationPreferences: PreferencesPayload;
  guestUpdateProfile: GuestProfilePayload;
  guestUploadProfilePhoto: GuestProfilePayload;
  guestUploadReportAttachment: ReportPayload;
  markAllAsRead: BulkNotificationResult;
  markAllNotificationsAsRead: Scalars['Boolean']['output'];
  markAsRead: NotificationPayload;
  markNotificationAsRead: NotificationPayload;
  processDisbursement: AwardPayload;
  publishReport: ReportPayload;
  reconcileTransaction: FinancialPayload;
  recordExpenditure: FinancialPayload;
  recordFundingTransaction: DisbursementRecord;
  recordRevenue: FinancialPayload;
  recordTransaction: FinancialPayload;
  rejectDisbursement: Scalars['Boolean']['output'];
  rejectFunding: FundingPayload;
  rejectFundingRequest: Award;
  rejectMilestone: MilestonePayload;
  rejectProposal: ProposalPayload;
  rejectReport: ReportPayload;
  rejectTransaction: FinancialPayload;
  removeBookmark: GrantCallBookmarkPayload;
  removeCollaborator: ProposalPayload;
  removeProposalCoPi: ProposalPayload;
  requestDisbursement: AwardPayload;
  requestProposalReview: ProposalPayload;
  requestReportRevision: ReportPayload;
  researcherApproveProposal: ProposalPayload;
  researcherBulkApproveProposals: Array<Proposal>;
  researcherBulkRejectProposals: Array<Proposal>;
  researcherDeleteProposal: Scalars['Boolean']['output'];
  researcherRejectProposal: ProposalPayload;
  researcherReviseProposal: ProposalPayload;
  resetPassword?: Maybe<Scalars['Boolean']['output']>;
  resetSettings: SettingsPayload;
  resetUserPassword: GenericPayload;
  respondToEvent: EventPayload;
  resumeAward: AwardPayload;
  rsvpToMeeting: EventPayload;
  saveDraft: ReportPayload;
  saveDraftFinanceReport: FinanceReport;
  saveProposalDraft: ProposalPayload;
  saveReportDraft: ReportPayload;
  scheduleFinanceMeeting: FinanceEvent;
  scheduleMeeting: EventPayload;
  setFinanceReminder: FinanceEvent;
  setNewPassword: GenericPayload;
  setReminder: EventPayload;
  signIn?: Maybe<AuthUser>;
  submitApplication: Application;
  submitFinanceReport: FinanceReport;
  submitMilestoneEvidence: MilestonePayload;
  submitProposal: ProposalPayload;
  submitProposalContribution: ProposalPayload;
  submitReport: ReportPayload;
  suspendAward: AwardPayload;
  suspendUser?: Maybe<User>;
  updateAccountSettings: AccountSettings;
  updateApplication: Application;
  updateApplicationSettings: SettingsPayload;
  updateApplicationStatus: Application;
  updateAward: AwardPayload;
  updateAwardStatus: Award;
  updateBookmarkNotes: GrantCallBookmarkPayload;
  updateBudget: FinancialPayload;
  updateCalendarEvent: CalendarEventPayload;
  updateEmailSettings: SettingsPayload;
  updateEvent: EventPayload;
  updateFeatureFlag: FeatureFlag;
  updateFinanceEvent: FinanceEvent;
  updateFinanceReport: FinanceReport;
  updateFinancialPreferences: FinancialPreferences;
  updateFundingAllocation: AwardPayload;
  updateFundingCall: FundingCall;
  updateMilestone: MilestonePayload;
  updateMilestoneProgress: MilestonePayload;
  updateMilestoneStatus: MilestonePayload;
  updateNotificationPreferences: NotificationPayload;
  updateNotificationSettings: SettingsPayload;
  updateProfile?: Maybe<User>;
  updateProposal: ProposalPayload;
  updateProposalSection: ProposalPayload;
  updateReport: ReportPayload;
  updateReportingPreferences: ReportingPreferences;
  updateResearcherProfile: ResearcherProfilePayload;
  updateSecuritySettings: SettingsPayload;
  updateSystemSettings: SettingsPayload;
  updateUser?: Maybe<User>;
  updateUserStatus?: Maybe<User>;
  uploadAttachment: ReportPayload;
  uploadEvidence: MilestonePayload;
  uploadFinanceAttachments: FinanceReport;
  uploadFundingDocumentation: Award;
  uploadMilestoneAttachment: MilestonePayload;
  uploadProfileImage: FinanceOfficerProfile;
  uploadProfilePhoto: PhotoPayload;
  uploadProposalAttachment: ProposalPayload;
  uploadReportAttachment: AttachmentPayload;
  verify2FASetup: GenericPayload;
  withdrawApplication: Application;
};


export type MutationActivateUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationAddCollaboratorArgs = {
  collaboratorId: Scalars['ID']['input'];
  proposalId: Scalars['ID']['input'];
};


export type MutationAddMilestoneCommentArgs = {
  comment: Scalars['String']['input'];
  milestoneId: Scalars['String']['input'];
};


export type MutationAddProposalCommentArgs = {
  comment: Scalars['String']['input'];
  proposalId: Scalars['String']['input'];
};


export type MutationAddReportCommentArgs = {
  comment: Scalars['String']['input'];
  reportId: Scalars['String']['input'];
};


export type MutationAdminSignUpArgs = {
  content?: InputMaybe<AdminSignUpContent>;
};


export type MutationApproveBudgetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationApproveDisbursementArgs = {
  transactionId: Scalars['String']['input'];
};


export type MutationApproveFundingArgs = {
  input: ApproveFundingInput;
};


export type MutationApproveFundingRequestArgs = {
  fundingRequestId: Scalars['ID']['input'];
};


export type MutationApproveMilestoneArgs = {
  input: ApproveMilestoneInput;
};


export type MutationApproveProposalArgs = {
  input: ApproveProposalInput;
};


export type MutationApproveReportArgs = {
  id: Scalars['String']['input'];
  input: ApproveReportInput;
};


export type MutationApproveTransactionArgs = {
  input: ApproveTransactionInput;
};


export type MutationArchiveNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveProposalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveReportArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAssignGuestToFundingCallArgs = {
  input: AssignGuestToFundingCallInput;
};


export type MutationAssignGuestToProposalArgs = {
  input: AssignGuestToProposalInput;
};


export type MutationAssignMilestoneArgs = {
  id: Scalars['ID']['input'];
  researcherId: Scalars['ID']['input'];
};


export type MutationAssignReviewersArgs = {
  input: AssignReviewersInput;
};


export type MutationAssignRoleArgs = {
  input: AssignRoleInput;
};


export type MutationBookmarkGrantCallArgs = {
  fundingCallId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  userID: Scalars['ID']['input'];
};


export type MutationBulkApproveProposalsArgs = {
  input: BulkProposalActionInput;
};


export type MutationBulkCreateUsersArgs = {
  base64Csv: Scalars['String']['input'];
  input: BulkCreateUsersInput;
};


export type MutationBulkRejectProposalsArgs = {
  input: BulkProposalActionInput;
};


export type MutationCancelAwardArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationCancelEventArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCancelMilestoneArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationCloseBudgetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCompleteMilestoneArgs = {
  id: Scalars['String']['input'];
  input: CompleteMilestoneInput;
};


export type MutationCompleteMilestoneTaskArgs = {
  milestoneId: Scalars['String']['input'];
  taskId: Scalars['String']['input'];
};


export type MutationConfigureReminderArgs = {
  input: ConfigureReminderInput;
};


export type MutationCreateApplicationArgs = {
  content: CreateApplicationInput;
};


export type MutationCreateAwardArgs = {
  input: CreateAwardInput;
};


export type MutationCreateBudgetArgs = {
  input: CreateBudgetInput;
};


export type MutationCreateCalendarEventArgs = {
  input: CreateCalendarEventInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateFeatureFlagArgs = {
  input: FeatureFlagInput;
};


export type MutationCreateFinanceEventArgs = {
  input: CreateFinanceEventInput;
};


export type MutationCreateFundingAllocationArgs = {
  input: CreateFundingAllocationInput;
};


export type MutationCreateFundingCallArgs = {
  content: CreateFundingCallInput;
};


export type MutationCreateGuestArgs = {
  content: CreateGuestInput;
};


export type MutationCreateMilestoneArgs = {
  input: CreateMilestoneInput;
};


export type MutationCreateProposalArgs = {
  input: CreateProposalInput;
};


export type MutationCreateProposalDraftArgs = {
  input: CreateProposalDraftInput;
};


export type MutationCreateReportArgs = {
  input: CreateReportInput;
};


export type MutationCreateReportDraftArgs = {
  input: CreateReportDraftInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteApplicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCalendarEventArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFeatureFlagArgs = {
  key: Scalars['String']['input'];
};


export type MutationDeleteFinanceEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFundingCallArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMilestoneArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteReportArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDisableNotificationTypeArgs = {
  type: NotificationType;
  userId: Scalars['ID']['input'];
};


export type MutationEnableMaintenanceModeArgs = {
  message?: InputMaybe<Scalars['String']['input']>;
};


export type MutationEnableNotificationTypeArgs = {
  type: NotificationType;
  userId: Scalars['ID']['input'];
};


export type MutationExportFinanceReportArgs = {
  input: ExportReportInput;
};


export type MutationExportReportArgs = {
  input: ExportReportInput;
};


export type MutationForgotPasswordArgs = {
  content?: InputMaybe<ForgotPasswordContent>;
};


export type MutationGenerateFinanceReportArgs = {
  input: GenerateReportInput;
};


export type MutationGenerateReportArgs = {
  input: GenerateReportInput;
};


export type MutationGuestChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationGuestUpdateNotificationPreferencesArgs = {
  input: NotificationPreferencesInput;
};


export type MutationGuestUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationGuestUploadProfilePhotoArgs = {
  file: Scalars['String']['input'];
};


export type MutationGuestUploadReportAttachmentArgs = {
  file: Scalars['String']['input'];
  reportId: Scalars['String']['input'];
};


export type MutationMarkAllAsReadArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationMarkAsReadArgs = {
  notificationId: Scalars['ID']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationProcessDisbursementArgs = {
  input: ProcessDisbursementInput;
};


export type MutationPublishReportArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReconcileTransactionArgs = {
  input: ReconcileTransactionInput;
};


export type MutationRecordExpenditureArgs = {
  input: RecordTransactionInput;
};


export type MutationRecordFundingTransactionArgs = {
  amount: Scalars['Float']['input'];
  awardId: Scalars['ID']['input'];
  description: Scalars['String']['input'];
};


export type MutationRecordRevenueArgs = {
  input: RecordTransactionInput;
};


export type MutationRecordTransactionArgs = {
  input: RecordTransactionInput;
};


export type MutationRejectDisbursementArgs = {
  transactionId: Scalars['String']['input'];
};


export type MutationRejectFundingArgs = {
  input: RejectFundingInput;
};


export type MutationRejectFundingRequestArgs = {
  fundingRequestId: Scalars['ID']['input'];
};


export type MutationRejectMilestoneArgs = {
  input: RejectMilestoneInput;
};


export type MutationRejectProposalArgs = {
  input: RejectProposalInput;
};


export type MutationRejectReportArgs = {
  input: RejectReportInput;
};


export type MutationRejectTransactionArgs = {
  input: RejectTransactionInput;
};


export type MutationRemoveBookmarkArgs = {
  fundingCallId: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
};


export type MutationRemoveCollaboratorArgs = {
  collaboratorId: Scalars['ID']['input'];
  proposalId: Scalars['ID']['input'];
};


export type MutationRemoveProposalCoPiArgs = {
  proposalId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRequestDisbursementArgs = {
  id: Scalars['String']['input'];
  input: RequestDisbursementInput;
};


export type MutationRequestProposalReviewArgs = {
  proposalId: Scalars['String']['input'];
};


export type MutationRequestReportRevisionArgs = {
  comment: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationResearcherApproveProposalArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type MutationResearcherBulkApproveProposalsArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationResearcherBulkRejectProposalsArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationResearcherDeleteProposalArgs = {
  id: Scalars['String']['input'];
};


export type MutationResearcherRejectProposalArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type MutationResearcherReviseProposalArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  content?: InputMaybe<ResetPasswordContent>;
};


export type MutationResetUserPasswordArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationRespondToEventArgs = {
  eventId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
};


export type MutationResumeAwardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRsvpToMeetingArgs = {
  eventId: Scalars['String']['input'];
  response: Scalars['String']['input'];
};


export type MutationSaveDraftArgs = {
  content: Scalars['String']['input'];
  reportId: Scalars['ID']['input'];
};


export type MutationSaveDraftFinanceReportArgs = {
  content: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type MutationSaveProposalDraftArgs = {
  data: ProposalDataInput;
  id: Scalars['String']['input'];
  input: SaveProposalDraftInput;
};


export type MutationSaveReportDraftArgs = {
  data: ReportDataInput;
  id: Scalars['String']['input'];
};


export type MutationScheduleFinanceMeetingArgs = {
  input: ScheduleMeetingInput;
};


export type MutationScheduleMeetingArgs = {
  input: ScheduleMeetingInput;
};


export type MutationSetFinanceReminderArgs = {
  input: SetReminderInput;
};


export type MutationSetNewPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSetReminderArgs = {
  eventId: Scalars['String']['input'];
  minutesBefore: Scalars['Int']['input'];
};


export type MutationSignInArgs = {
  content?: InputMaybe<SignInContent>;
};


export type MutationSubmitApplicationArgs = {
  content: SubmitApplicationInput;
};


export type MutationSubmitFinanceReportArgs = {
  input: SubmitReportInput;
};


export type MutationSubmitMilestoneEvidenceArgs = {
  evidence: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationSubmitProposalArgs = {
  id: Scalars['String']['input'];
};


export type MutationSubmitProposalContributionArgs = {
  contribution: Scalars['String']['input'];
  proposalId: Scalars['String']['input'];
};


export type MutationSubmitReportArgs = {
  id: Scalars['String']['input'];
  input: SubmitReportInput;
};


export type MutationSuspendAwardArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationSuspendUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationUpdateAccountSettingsArgs = {
  input: UpdateAccountSettingsInput;
};


export type MutationUpdateApplicationArgs = {
  content: UpdateApplicationInput;
};


export type MutationUpdateApplicationSettingsArgs = {
  input: ApplicationSettingsInput;
};


export type MutationUpdateApplicationStatusArgs = {
  content: UpdateApplicationStatusInput;
};


export type MutationUpdateAwardArgs = {
  input: UpdateAwardInput;
};


export type MutationUpdateAwardStatusArgs = {
  awardId: Scalars['ID']['input'];
  status: AwardStatus;
};


export type MutationUpdateBookmarkNotesArgs = {
  fundingCallId: Scalars['ID']['input'];
  notes: Scalars['String']['input'];
  userID: Scalars['ID']['input'];
};


export type MutationUpdateBudgetArgs = {
  input: UpdateBudgetInput;
};


export type MutationUpdateCalendarEventArgs = {
  id: Scalars['String']['input'];
  input: UpdateCalendarEventInput;
};


export type MutationUpdateEmailSettingsArgs = {
  input: EmailSettingsInput;
};


export type MutationUpdateEventArgs = {
  id: Scalars['String']['input'];
  input: UpdateEventInput;
};


export type MutationUpdateFeatureFlagArgs = {
  input: FeatureFlagInput;
  key: Scalars['String']['input'];
};


export type MutationUpdateFinanceEventArgs = {
  input: UpdateFinanceEventInput;
};


export type MutationUpdateFinanceReportArgs = {
  input: UpdateReportInput;
};


export type MutationUpdateFinancialPreferencesArgs = {
  input: UpdateFinancialPreferencesInput;
};


export type MutationUpdateFundingAllocationArgs = {
  input: UpdateFundingAllocationInput;
};


export type MutationUpdateFundingCallArgs = {
  content: UpdateFundingCallInput;
};


export type MutationUpdateMilestoneArgs = {
  id: Scalars['String']['input'];
  input: UpdateMilestoneInput;
};


export type MutationUpdateMilestoneProgressArgs = {
  completionPercentage: Scalars['Int']['input'];
  id: Scalars['String']['input'];
};


export type MutationUpdateMilestoneStatusArgs = {
  id: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationUpdateNotificationPreferencesArgs = {
  input: NotificationPreferencesInput;
};


export type MutationUpdateNotificationSettingsArgs = {
  input: NotificationSettingsInput;
};


export type MutationUpdateProfileArgs = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneContact?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateProposalArgs = {
  id: Scalars['String']['input'];
  input: UpdateProposalInput;
};


export type MutationUpdateProposalSectionArgs = {
  content: Scalars['String']['input'];
  id: Scalars['String']['input'];
  section: Scalars['String']['input'];
};


export type MutationUpdateReportArgs = {
  id: Scalars['String']['input'];
  input: UpdateReportInput;
};


export type MutationUpdateReportingPreferencesArgs = {
  input: UpdateReportingPreferencesInput;
};


export type MutationUpdateResearcherProfileArgs = {
  input: UpdateResearcherProfileInput;
  userId: Scalars['String']['input'];
};


export type MutationUpdateSecuritySettingsArgs = {
  input: SecuritySettingsInput;
};


export type MutationUpdateSystemSettingsArgs = {
  input: SystemSettingsInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserStatusArgs = {
  input: UserStatusInput;
};


export type MutationUploadAttachmentArgs = {
  fileName: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
  reportId: Scalars['ID']['input'];
};


export type MutationUploadEvidenceArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  fileUrl: Scalars['String']['input'];
  milestoneId: Scalars['ID']['input'];
};


export type MutationUploadFinanceAttachmentsArgs = {
  fileName: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
  reportId: Scalars['ID']['input'];
};


export type MutationUploadFundingDocumentationArgs = {
  awardId: Scalars['ID']['input'];
  fileName: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
};


export type MutationUploadMilestoneAttachmentArgs = {
  file: Scalars['String']['input'];
  milestoneId: Scalars['String']['input'];
};


export type MutationUploadProfileImageArgs = {
  input: UploadProfileImageInput;
};


export type MutationUploadProfilePhotoArgs = {
  file: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationUploadProposalAttachmentArgs = {
  file: Scalars['String']['input'];
  proposalId: Scalars['String']['input'];
};


export type MutationUploadReportAttachmentArgs = {
  file: Scalars['String']['input'];
  reportId: Scalars['String']['input'];
};


export type MutationVerify2FaSetupArgs = {
  code: Scalars['String']['input'];
};


export type MutationWithdrawApplicationArgs = {
  id: Scalars['ID']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  actionUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  readAt?: Maybe<Scalars['String']['output']>;
  status: NotificationStatus;
  title: Scalars['String']['output'];
  type: NotificationType;
  userId: Scalars['ID']['output'];
};

export type NotificationCategory =
  | 'ANALYTICS'
  | 'AWARDS'
  | 'CALENDAR'
  | 'FINANCIAL'
  | 'FUNDING'
  | 'REPORTS'
  | 'SYSTEM';

export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  edges: Array<NotificationEdge>;
  nodes: Array<FinanceNotification>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type NotificationCounts = {
  __typename?: 'NotificationCounts';
  byCategory: Array<CategoryCount>;
  total: Scalars['Int']['output'];
  unread: Scalars['Int']['output'];
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor: Scalars['String']['output'];
  node: Notification;
};

export type NotificationFilterInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  statuses?: InputMaybe<Array<NotificationStatus>>;
  types?: InputMaybe<Array<NotificationType>>;
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationPayload = {
  __typename?: 'NotificationPayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  notification?: Maybe<Notification>;
  success: Scalars['Boolean']['output'];
};

export type NotificationPreference = {
  __typename?: 'NotificationPreference';
  category: NotificationCategory;
  dashboardEnabled: Scalars['Boolean']['output'];
  emailEnabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type NotificationPreferences = {
  __typename?: 'NotificationPreferences';
  emailEnabled: Scalars['Boolean']['output'];
  emailNotifications: Scalars['Boolean']['output'];
  financial: Scalars['Boolean']['output'];
  funding: Scalars['Boolean']['output'];
  grantCalls: Scalars['Boolean']['output'];
  grantCallsNotifications: Scalars['Boolean']['output'];
  inAppEnabled: Scalars['Boolean']['output'];
  inAppNotifications: Scalars['Boolean']['output'];
  milestoneNotifications: Scalars['Boolean']['output'];
  milestones: Scalars['Boolean']['output'];
  proposalNotifications: Scalars['Boolean']['output'];
  proposals: Scalars['Boolean']['output'];
  pushNotifications: Scalars['Boolean']['output'];
  reportNotifications: Scalars['Boolean']['output'];
  reports: Scalars['Boolean']['output'];
  system: Scalars['Boolean']['output'];
  systemNotifications: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  users: Scalars['Boolean']['output'];
};

export type NotificationPreferencesInput = {
  approvals?: InputMaybe<Scalars['Boolean']['input']>;
  deadlines?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['Boolean']['input']>;
  emailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  emailNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  financial?: InputMaybe<Scalars['Boolean']['input']>;
  funding?: InputMaybe<Scalars['Boolean']['input']>;
  grantCalls?: InputMaybe<Scalars['Boolean']['input']>;
  grantCallsNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  inApp?: InputMaybe<Scalars['Boolean']['input']>;
  inAppEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  inAppNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  milestoneNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  milestones?: InputMaybe<Scalars['Boolean']['input']>;
  payments?: InputMaybe<Scalars['Boolean']['input']>;
  proposalNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  proposals?: InputMaybe<Scalars['Boolean']['input']>;
  pushNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  reportNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  reports?: InputMaybe<Scalars['Boolean']['input']>;
  system?: InputMaybe<Scalars['Boolean']['input']>;
  systemNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['ID']['input'];
  users?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationSettings = {
  __typename?: 'NotificationSettings';
  defaultLanguage: Scalars['String']['output'];
  emailNotificationsEnabled: Scalars['Boolean']['output'];
  notificationFrequency: Scalars['String']['output'];
  pushNotificationsEnabled: Scalars['Boolean']['output'];
  smsNotificationsEnabled: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
};

export type NotificationSettingsInput = {
  defaultLanguage?: InputMaybe<Scalars['String']['input']>;
  emailNotificationsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  notificationFrequency?: InputMaybe<Scalars['String']['input']>;
  pushNotificationsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  smsNotificationsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationStats = {
  __typename?: 'NotificationStats';
  byType: Array<NotificationTypeCount>;
  totalCount: Scalars['Int']['output'];
  unreadCount: Scalars['Int']['output'];
};

export type NotificationStatus =
  | 'ARCHIVED'
  | 'READ'
  | 'UNREAD';

export type NotificationType =
  | 'FINANCIAL'
  | 'FUNDING'
  | 'GRANT_CALL'
  | 'MILESTONE'
  | 'PROPOSAL'
  | 'REPORT'
  | 'SYSTEM'
  | 'USER';

export type NotificationTypeCount = {
  __typename?: 'NotificationTypeCount';
  count: Scalars['Int']['output'];
  type: NotificationType;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage?: Maybe<Scalars['Int']['output']>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type PaginationInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export type PasswordPayload = {
  __typename?: 'PasswordPayload';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type PendingReviewItem = {
  __typename?: 'PendingReviewItem';
  id: Scalars['ID']['output'];
  requestedAmount: Scalars['Float']['output'];
  researcher: Scalars['String']['output'];
  status: Scalars['String']['output'];
  submittedDate: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type PhotoPayload = {
  __typename?: 'PhotoPayload';
  message: Scalars['String']['output'];
  photoUrl?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type PreferencesPayload = {
  __typename?: 'PreferencesPayload';
  message: Scalars['String']['output'];
  preferences?: Maybe<NotificationPreferences>;
  success: Scalars['Boolean']['output'];
};

export type ProcessDisbursementInput = {
  amount: Scalars['Float']['input'];
  awardId: Scalars['ID']['input'];
  description: Scalars['String']['input'];
};

export type Proposal = {
  __typename?: 'Proposal';
  abstract?: Maybe<Scalars['String']['output']>;
  coPIs?: Maybe<Array<User>>;
  collaborators?: Maybe<Array<ProposalCollaborator>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  fundingCall?: Maybe<FundingCall>;
  id: Scalars['ID']['output'];
  requestedAmount?: Maybe<Scalars['Float']['output']>;
  reviewHistory?: Maybe<Array<ReviewEntry>>;
  status: ProposalStatus;
  submittedAt?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type ProposalAnalytics = {
  __typename?: 'ProposalAnalytics';
  approvalRate: Scalars['Float']['output'];
  approved: Scalars['Int']['output'];
  avgTimeToApproval: Scalars['Int']['output'];
  funded: Scalars['Int']['output'];
  fundingRate: Scalars['Float']['output'];
  rejected: Scalars['Int']['output'];
  rejectionRate: Scalars['Float']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ProposalCollaborator = {
  __typename?: 'ProposalCollaborator';
  assignedBy: Scalars['ID']['output'];
  assigner?: Maybe<User>;
  createdAt: Scalars['String']['output'];
  guest?: Maybe<User>;
  guestId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  proposalId: Scalars['ID']['output'];
  roleDescription?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ProposalConnection = {
  __typename?: 'ProposalConnection';
  edges: Array<ProposalEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ProposalDataInput = {
  abstract?: InputMaybe<Scalars['String']['input']>;
  budget?: InputMaybe<Scalars['String']['input']>;
  methodology?: InputMaybe<Scalars['String']['input']>;
  objectives?: InputMaybe<Scalars['String']['input']>;
  requestedAmount?: InputMaybe<Scalars['Float']['input']>;
  timeline?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ProposalEdge = {
  __typename?: 'ProposalEdge';
  cursor: Scalars['String']['output'];
  node: Proposal;
};

export type ProposalFilterInput = {
  dateRange?: InputMaybe<DateRangeInput>;
  departments?: InputMaybe<Array<Scalars['String']['input']>>;
  fundingCallId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<ProposalStatus>>;
  userID?: InputMaybe<Scalars['ID']['input']>;
};

export type ProposalPayload = {
  __typename?: 'ProposalPayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  proposal?: Maybe<Proposal>;
  success: Scalars['Boolean']['output'];
};

export type ProposalReview = {
  __typename?: 'ProposalReview';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  proposalId: Scalars['ID']['output'];
  reviewer: User;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ProposalReviewer = {
  __typename?: 'ProposalReviewer';
  department?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  reviewStatus?: Maybe<Scalars['String']['output']>;
};

export type ProposalSortField =
  | 'CREATED_AT'
  | 'REQUESTED_AMOUNT'
  | 'STATUS'
  | 'SUBMITTED_DATE'
  | 'TITLE'
  | 'USER';

export type ProposalSortInput = {
  direction: SortDirection;
  field: ProposalSortField;
};

export type ProposalStats = {
  __typename?: 'ProposalStats';
  approved: Scalars['Int']['output'];
  archived: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  funded: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
  revised: Scalars['Int']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
  withdrawn: Scalars['Int']['output'];
};

export type ProposalStatus =
  | 'approved'
  | 'archived'
  | 'draft'
  | 'funded'
  | 'rejected'
  | 'submitted'
  | 'under_review';

export type Query = {
  __typename?: 'Query';
  accountSettings: AccountSettings;
  auditLog?: Maybe<AuditLog>;
  auditLogs: AuditLogConnection;
  auditMetrics: AuditMetrics;
  award?: Maybe<Award>;
  awardAnalytics: AwardAnalytics;
  awardDetails: Award;
  awardStats: AwardStats;
  awards: AwardConnection;
  budgetAnalytics: Array<BudgetAnalytics>;
  budgetUtilization: Budget;
  calendarEvents: Array<CalendarEvent>;
  costCenters: Array<Scalars['String']['output']>;
  dashboard: FinanceDashboard;
  disbursementMetrics: DisbursementMetrics;
  eventDetails: FinanceEvent;
  exportAnalytics?: Maybe<Scalars['String']['output']>;
  financeReportDetails: FinanceReport;
  financeReportHistory: Array<FinanceReport>;
  financeReportStats: FinanceReportStats;
  financialHistory: Array<Transaction>;
  financialOverview: FinancialOverview;
  financialPreferences: FinancialPreferences;
  financialSummary: FinancialSummary;
  fundingAllocations: Array<FundingAllocation>;
  fundingDisbursements: Array<DisbursementRecord>;
  fundingHistory: Array<DisbursementRecord>;
  fundingStats: FundingStats;
  fundingTrends: Array<FundingTrend>;
  getAdminDashboard: AdminDashboard;
  getAllSettings: AllSettings;
  getAnalytics: AnalyticsData;
  getApplication?: Maybe<Application>;
  getApplicationSettings: ApplicationSettings;
  getApplications: Array<Application>;
  getAward?: Maybe<Award>;
  getAwardAllocations: Array<FundingAllocation>;
  getAwardAnalytics: AwardAnalytics;
  getAwardDisbursements: Array<FundingDisbursement>;
  getAwardMilestones: MilestoneConnection;
  getAwardReports: ReportConnection;
  getAwardStats: AwardStats;
  getBudget?: Maybe<Budget>;
  getCalendarStats: CalendarStats;
  getCostCenters: Array<CostCenter>;
  getDashboardAlerts: Array<DashboardAlert>;
  getDashboardMetrics: DashboardMetrics;
  getDashboardStats: DashboardStats;
  getDepartmentAnalytics: Array<DepartmentAnalytics>;
  getDepartmentDetail: DepartmentAnalytics;
  getEmailSettings: EmailSettings;
  getEvent?: Maybe<CalendarEvent>;
  getEventsByDate: Array<CalendarEvent>;
  getFeatureFlag?: Maybe<FeatureFlag>;
  getFeatureFlags: Array<FeatureFlag>;
  getFinancialAnalytics: FinancialAnalytics;
  getFinancialReport: FinancialSummary;
  getFinancialSummary: FinancialSummary;
  getFundingAnalytics: FundingAnalytics;
  getFundingByCategory: Array<FundingCategoryData>;
  getFundingCall?: Maybe<FundingCall>;
  getFundingCallCollaborators: Array<FundingCallCollaborator>;
  getFundingCalls: Array<FundingCall>;
  getFundingRequests: Array<FundingRequest>;
  getFundingStats: AwardStats;
  getFundingTrend: Array<TrendData>;
  getGrantCallAnalytics: GrantCallAnalytics;
  getGuestsForResearcher: Array<User>;
  getMilestone?: Maybe<Milestone>;
  getMilestoneEvidence: Array<MilestoneEvidence>;
  getMilestoneStats: MilestoneStats;
  getMonthlyApplicationStats: MonthlyApplicationStat;
  getMonthlyExpenditure: Array<MonthlyData>;
  getMonthlyProposalStats: Array<MonthlyProposalStat>;
  getMonthlyRevenue: Array<MonthlyData>;
  getMyApplications: Array<Application>;
  getNotification?: Maybe<Notification>;
  getNotificationPreferences: NotificationPreferences;
  getNotificationSettings: NotificationSettings;
  getNotificationStats: NotificationStats;
  getOverdueMilestones: MilestoneConnection;
  getPendingProposalsForReview: Array<Proposal>;
  getPendingReports: ReportConnection;
  getPendingReviews: Array<PendingReviewItem>;
  getProposal?: Maybe<Proposal>;
  getProposalAnalytics: ProposalAnalytics;
  getProposalCollaborators: Array<ProposalCollaborator>;
  getProposalReviews: Array<ProposalReview>;
  getProposalStats: ProposalStats;
  getProposalTrend: Array<TrendData>;
  getProposalsByStatus: ProposalConnection;
  getRecentActivities: Array<RecentActivity>;
  getRecentMilestones: Array<Milestone>;
  getReport?: Maybe<Report>;
  getReportRevisions: Array<ReportRevision>;
  getReportStats: ReportStats;
  getResearcherAnalytics: ResearcherAnalytics;
  getSecuritySettings: SecuritySettings;
  getSystemAnalytics: SystemAnalytics;
  getSystemSettings: SystemSettings;
  getTopDepartments: Array<DepartmentMetric>;
  getTopResearchers: Array<ResearcherMetric>;
  getTransaction?: Maybe<Transaction>;
  getUnreadNotifications: NotificationConnection;
  getUpcomingDeadlines: Array<CalendarEvent>;
  getUpcomingEvents: CalendarEventConnection;
  getUser?: Maybe<User>;
  getUserAnalytics: UserAnalytics;
  getUserCountByRole: Array<UserRoleCount>;
  getUserGrowthTrend: Array<TrendData>;
  getUserRoleDistribution: Array<UserRoleDistribution>;
  getUsers: UsersConnection;
  getUsersByRole: UsersConnection;
  getUsersWithStatus: UsersConnection;
  getYearlyApplicationStats: Array<MonthlyApplicationStat>;
  get_Admin?: Maybe<Admin>;
  get_Users?: Maybe<Array<Maybe<AuthUser>>>;
  grantCall?: Maybe<GuestGrantCall>;
  grantCalls: GuestGrantCallConnection;
  guestDashboard: GuestDashboard;
  guestNotificationPreferences: NotificationPreferences;
  guestProposal?: Maybe<Proposal>;
  guestProposalStats: GuestProposalStats;
  guestReportStats: GuestReportStats;
  isFeatureEnabled: Scalars['Boolean']['output'];
  listAwards: AwardConnection;
  listBudgets: BudgetConnection;
  listEvents: CalendarEventConnection;
  listFinanceReports: FinanceReportConnection;
  listMilestones: MilestoneConnection;
  listNotifications: NotificationConnection;
  listProposals: ProposalConnection;
  listReports: ReportConnection;
  listTransactions: TransactionConnection;
  milestone?: Maybe<Milestone>;
  milestoneStat: MilestoneStats;
  milestoneStats: GuestMilestoneStats;
  milestones: MilestoneConnection;
  myAwards: AwardConnection;
  myBookmarkedCalls: GuestGrantCallConnection;
  myCoPiProposals: ProposalConnection;
  myGuestProposals: ProposalConnection;
  myMilestones: MilestoneConnection;
  myNotifications: NotificationConnection;
  myProfile: GuestProfile;
  myProposalDrafts: ProposalConnection;
  myProposals: ProposalConnection;
  myReports: ReportConnection;
  notificationCount: Scalars['Int']['output'];
  notificationCounts: NotificationCounts;
  notificationHistory: NotificationConnection;
  notificationPreferences?: Maybe<NotificationPreference>;
  notifications: NotificationConnection;
  overdueMilestones: Array<Milestone>;
  profile: FinanceOfficerProfile;
  projectFinancials: FinancialSummary;
  proposal?: Maybe<Proposal>;
  proposalCollaborators: Array<Collaborator>;
  proposalDraft?: Maybe<Proposal>;
  proposalStats: ProposalStats;
  proposals: ProposalConnection;
  proposalsByResearcher: ProposalConnection;
  report?: Maybe<Report>;
  reportStats: ReportStats;
  reportingPreferences: ReportingPreferences;
  reports: ReportConnection;
  reportsByProject: ReportConnection;
  researcherProfile?: Maybe<ResearcherProfile>;
  securitySettings: SecuritySettings;
  transactionDetails: Transaction;
  transactionMetrics: TransactionMetrics;
  unreadNotificationCount: Scalars['Int']['output'];
  upcomingDeadlines: Array<UpcomingDeadline>;
  upcomingEvents: Array<CalendarEvent>;
  upcomingMilestones: Array<Milestone>;
};


export type QueryAuditLogArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAuditLogsArgs = {
  filter?: InputMaybe<AuditLogFilterInput>;
  pagination?: InputMaybe<AuditLogPaginationInput>;
  sortDirection?: InputMaybe<SortDirection>;
};


export type QueryAuditMetricsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryAwardArgs = {
  id: Scalars['String']['input'];
};


export type QueryAwardAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryAwardDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAwardsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  researcherId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBudgetAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryBudgetUtilizationArgs = {
  awardId: Scalars['ID']['input'];
};


export type QueryCalendarEventsArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryDisbursementMetricsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryEventDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryExportAnalyticsArgs = {
  format: Scalars['String']['input'];
};


export type QueryFinanceReportDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFinanceReportHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  reportId: Scalars['ID']['input'];
};


export type QueryFinancialHistoryArgs = {
  awardId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFinancialOverviewArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryFundingAllocationsArgs = {
  awardId?: InputMaybe<Scalars['ID']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFundingDisbursementsArgs = {
  awardId?: InputMaybe<Scalars['ID']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFundingHistoryArgs = {
  awardId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFundingTrendsArgs = {
  filter: AnalyticsFilterInput;
};


export type QueryGetAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetApplicationArgs = {
  filter?: InputMaybe<GetApplicationFilter>;
};


export type QueryGetApplicationsArgs = {
  filter?: InputMaybe<GetApplicationFilter>;
};


export type QueryGetAwardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetAwardAllocationsArgs = {
  awardId: Scalars['ID']['input'];
};


export type QueryGetAwardAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetAwardDisbursementsArgs = {
  awardId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPaginationInput>;
};


export type QueryGetAwardMilestonesArgs = {
  awardId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPaginationInput>;
};


export type QueryGetAwardReportsArgs = {
  awardId: Scalars['ID']['input'];
  pagination?: InputMaybe<CursorPaginationInput>;
};


export type QueryGetBudgetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetDashboardAlertsArgs = {
  severity?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetDepartmentAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetDepartmentDetailArgs = {
  department: Scalars['String']['input'];
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetEventsByDateArgs = {
  date: Scalars['String']['input'];
};


export type QueryGetFeatureFlagArgs = {
  key: Scalars['String']['input'];
};


export type QueryGetFinancialAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetFinancialReportArgs = {
  dateRange: DateRangeInput;
};


export type QueryGetFinancialSummaryArgs = {
  dateRange?: InputMaybe<DateRangeInput>;
};


export type QueryGetFundingAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetFundingCallArgs = {
  filter?: InputMaybe<GetFundingCallFilter>;
};


export type QueryGetFundingCallCollaboratorsArgs = {
  fundingCallId: Scalars['ID']['input'];
};


export type QueryGetFundingCallsArgs = {
  filter?: InputMaybe<GetFundingCallFilter>;
};


export type QueryGetFundingRequestsArgs = {
  awardId?: InputMaybe<Scalars['ID']['input']>;
  pagination?: InputMaybe<CursorPaginationInput>;
  status?: InputMaybe<FundingStatus>;
};


export type QueryGetFundingTrendArgs = {
  dateRange: DateRangeFilterInput;
};


export type QueryGetGrantCallAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetGuestsForResearcherArgs = {
  researcherId: Scalars['ID']['input'];
};


export type QueryGetMilestoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetMilestoneEvidenceArgs = {
  milestoneId: Scalars['ID']['input'];
};


export type QueryGetMonthlyApplicationStatsArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetMonthlyExpenditureArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  year: Scalars['Int']['input'];
};


export type QueryGetMonthlyProposalStatsArgs = {
  year: Scalars['Int']['input'];
};


export type QueryGetMonthlyRevenueArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  year: Scalars['Int']['input'];
};


export type QueryGetNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetNotificationPreferencesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetNotificationStatsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetOverdueMilestonesArgs = {
  pagination?: InputMaybe<CursorPaginationInput>;
};


export type QueryGetPendingProposalsForReviewArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPendingReportsArgs = {
  pagination?: InputMaybe<CursorPaginationInput>;
};


export type QueryGetPendingReviewsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetProposalArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProposalAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetProposalCollaboratorsArgs = {
  proposalId: Scalars['ID']['input'];
};


export type QueryGetProposalReviewsArgs = {
  proposalId: Scalars['ID']['input'];
};


export type QueryGetProposalTrendArgs = {
  dateRange: DateRangeFilterInput;
};


export type QueryGetProposalsByStatusArgs = {
  pagination?: InputMaybe<CursorPaginationInput>;
  status: ProposalStatus;
};


export type QueryGetRecentActivitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetRecentMilestonesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetReportRevisionsArgs = {
  reportId: Scalars['ID']['input'];
};


export type QueryGetResearcherAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetSystemAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetTopDepartmentsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetTopResearchersArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUnreadNotificationsArgs = {
  pagination?: InputMaybe<CursorPaginationInput>;
  userId: Scalars['ID']['input'];
};


export type QueryGetUpcomingDeadlinesArgs = {
  pagination?: InputMaybe<CursorPaginationInput>;
};


export type QueryGetUpcomingEventsArgs = {
  days?: InputMaybe<Scalars['Int']['input']>;
  pagination?: InputMaybe<CursorPaginationInput>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserAnalyticsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryGetUserGrowthTrendArgs = {
  dateRange: DateRangeFilterInput;
};


export type QueryGetUsersArgs = {
  input?: InputMaybe<GetUsersInput>;
};


export type QueryGetUsersByRoleArgs = {
  pagination?: InputMaybe<PaginationInput>;
  role: UserRole;
};


export type QueryGetUsersWithStatusArgs = {
  pagination?: InputMaybe<PaginationInput>;
  status: UserStatus;
};


export type QueryGetYearlyApplicationStatsArgs = {
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGet_AdminArgs = {
  filter?: InputMaybe<GetAdminFilter>;
};


export type QueryGet_UsersArgs = {
  filter?: InputMaybe<GetUserFilter>;
};


export type QueryGrantCallArgs = {
  id: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
};


export type QueryGrantCallsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  userID?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGuestProposalArgs = {
  id: Scalars['String']['input'];
};


export type QueryIsFeatureEnabledArgs = {
  key: Scalars['String']['input'];
};


export type QueryListAwardsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  input: GetAwardsInput;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<AwardStatus>;
};


export type QueryListBudgetsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  input: GetBudgetsInput;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<BudgetStatus>;
};


export type QueryListEventsArgs = {
  input: GetCalendarEventsInput;
};


export type QueryListFinanceReportsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<FinanceReportStatus>;
  type?: InputMaybe<FinanceReportType>;
};


export type QueryListMilestonesArgs = {
  input: GetMilestonesInput;
};


export type QueryListNotificationsArgs = {
  category?: InputMaybe<NotificationCategory>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  input: GetNotificationsInput;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListProposalsArgs = {
  input: GetProposalsInput;
};


export type QueryListReportsArgs = {
  input: GetReportsInput;
};


export type QueryListTransactionsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  input: GetTransactionsInput;
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TransactionStatus>;
};


export type QueryMilestoneArgs = {
  id: Scalars['String']['input'];
};


export type QueryMilestonesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyAwardsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyBookmarkedCallsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyCoPiProposalsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyGuestProposalsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyMilestonesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyProposalDraftsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyProposalsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNotificationCountArgs = {
  userId: Scalars['String']['input'];
};


export type QueryNotificationHistoryArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNotificationPreferencesArgs = {
  userId: Scalars['String']['input'];
};


export type QueryNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  read?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryProjectFinancialsArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryProposalArgs = {
  id: Scalars['String']['input'];
};


export type QueryProposalCollaboratorsArgs = {
  proposalId: Scalars['String']['input'];
};


export type QueryProposalDraftArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProposalsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProposalsByResearcherArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  researcherId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReportArgs = {
  id: Scalars['String']['input'];
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type QueryReportsByProjectArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['String']['input'];
};


export type QueryResearcherProfileArgs = {
  userId: Scalars['String']['input'];
};


export type QueryTransactionDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionMetricsArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryUpcomingDeadlinesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUpcomingEventsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryUpcomingMilestonesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type RecentActivity = {
  __typename?: 'RecentActivity';
  action: Scalars['String']['output'];
  actor: User;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  module: Scalars['String']['output'];
  resourceId?: Maybe<Scalars['String']['output']>;
  resourceType?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
};

export type RecentTransaction = {
  __typename?: 'RecentTransaction';
  amount: Scalars['Float']['output'];
  date: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ReconcileTransactionInput = {
  reconciliationNotes?: InputMaybe<Scalars['String']['input']>;
  transactionId: Scalars['ID']['input'];
};

export type RecordExpenditureInput = {
  amount: Scalars['Float']['input'];
  awardId: Scalars['ID']['input'];
  category: Scalars['String']['input'];
  description: Scalars['String']['input'];
};

export type RecordIncomeInput = {
  amount: Scalars['Float']['input'];
  awardId: Scalars['ID']['input'];
  description: Scalars['String']['input'];
  source: Scalars['String']['input'];
};

export type RecordTransactionInput = {
  amount: Scalars['Float']['input'];
  awardId: Scalars['ID']['input'];
  costCenter?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  description: Scalars['String']['input'];
  type: TransactionType;
};

export type RejectFundingInput = {
  fundingRequestId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

export type RejectMilestoneInput = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  requiredActions?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RejectProposalInput = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  reviewerNotes?: InputMaybe<Scalars['String']['input']>;
};

export type RejectReportInput = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
  requiredRevisions?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RejectTransactionInput = {
  reason: Scalars['String']['input'];
  transactionId: Scalars['ID']['input'];
};

export type Report = {
  __typename?: 'Report';
  approvalNotes?: Maybe<Scalars['String']['output']>;
  approvedBy?: Maybe<User>;
  approvedDate?: Maybe<Scalars['String']['output']>;
  attachments?: Maybe<Array<ReportAttachment>>;
  award: Award;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  period: ReportPeriod;
  publishedDate?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  revisions?: Maybe<Array<ReportRevision>>;
  startDate: Scalars['String']['output'];
  status: ReportStatus;
  submittedBy?: Maybe<User>;
  submittedDate?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: ReportType;
  updatedAt: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type ReportAttachment = {
  __typename?: 'ReportAttachment';
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  uploadedAt: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ReportConnection = {
  __typename?: 'ReportConnection';
  edges: Array<ReportEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ReportDataInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  executiveSummary?: InputMaybe<Scalars['String']['input']>;
  findings?: InputMaybe<Scalars['String']['input']>;
  recommendations?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ReportEdge = {
  __typename?: 'ReportEdge';
  cursor: Scalars['String']['output'];
  node: Report;
};

export type ReportFilterInput = {
  awardId?: InputMaybe<Scalars['ID']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  period?: InputMaybe<ReportPeriod>;
  search?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<ReportStatus>>;
  types?: InputMaybe<Array<ReportType>>;
};

export type ReportPayload = {
  __typename?: 'ReportPayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  report?: Maybe<Report>;
  success: Scalars['Boolean']['output'];
};

export type ReportPeriod =
  | 'ANNUAL'
  | 'CUSTOM'
  | 'MONTHLY'
  | 'QUARTERLY';

export type ReportRevision = {
  __typename?: 'ReportRevision';
  content: Scalars['String']['output'];
  feedback?: Maybe<Scalars['String']['output']>;
  status: ReportStatus;
  submittedAt: Scalars['String']['output'];
  submittedBy: User;
  version: Scalars['Int']['output'];
};

export type ReportSortField =
  | 'CREATED_AT'
  | 'PROJECT'
  | 'STATUS'
  | 'SUBMITTED_DATE'
  | 'TITLE'
  | 'TYPE';

export type ReportSortInput = {
  direction: SortDirection;
  field: ReportSortField;
};

export type ReportStats = {
  __typename?: 'ReportStats';
  approved: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  published: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
};

export type ReportStatus =
  | 'APPROVED'
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW';

export type ReportType =
  | 'ANNUAL_REPORT'
  | 'AUDIT_REPORT'
  | 'COMPLIANCE_REPORT'
  | 'CUSTOM_REPORT'
  | 'FINANCIAL_REPORT'
  | 'PROGRESS_REPORT'
  | 'QUARTERLY_REPORT'
  | 'RESEARCH_REPORT';

export type ReportingPreferences = {
  __typename?: 'ReportingPreferences';
  autoGenerateReports: Scalars['Boolean']['output'];
  exportFormat: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reportingFrequency: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type RequestDisbursementInput = {
  amount: Scalars['Float']['input'];
  description: Scalars['String']['input'];
};

export type ResearcherAnalytics = {
  __typename?: 'ResearcherAnalytics';
  activeResearchers: Scalars['Int']['output'];
  approvalRate: Scalars['Float']['output'];
  avgGrantSize: Scalars['Float']['output'];
  proposalsApproved: Scalars['Int']['output'];
  proposalsSubmitted: Scalars['Int']['output'];
  totalResearchers: Scalars['Int']['output'];
};

export type ResearcherMetric = {
  __typename?: 'ResearcherMetric';
  proposalsApproved: Scalars['Int']['output'];
  proposalsSubmitted: Scalars['Int']['output'];
  researcher: User;
  totalFunding: Scalars['Float']['output'];
};

export type ResearcherProfile = {
  __typename?: 'ResearcherProfile';
  avatar?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  department?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  institution?: Maybe<Scalars['String']['output']>;
  joined?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phoneContact?: Maybe<Scalars['String']['output']>;
  researchInterests?: Maybe<Array<Scalars['String']['output']>>;
  role: Scalars['String']['output'];
  staffId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type ResearcherProfilePayload = {
  __typename?: 'ResearcherProfilePayload';
  message: Scalars['String']['output'];
  profile?: Maybe<ResearcherProfile>;
  success: Scalars['Boolean']['output'];
};

export type ResetPasswordContent = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type ReviewEntry = {
  __typename?: 'ReviewEntry';
  action: Scalars['String']['output'];
  comment: Scalars['String']['output'];
  date: Scalars['String']['output'];
  reviewer: Scalars['String']['output'];
  reviewerRole: Scalars['String']['output'];
};

export type SaveProposalDraftInput = {
  abstract?: InputMaybe<Scalars['String']['input']>;
  coPiIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  fundingCallId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  requestedAmount?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type ScheduleMeetingInput = {
  attendeeIds: Array<Scalars['ID']['input']>;
  attendees: Array<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  meetingUrl?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type SecuritySettings = {
  __typename?: 'SecuritySettings';
  id: Scalars['ID']['output'];
  lastPasswordChange?: Maybe<Scalars['String']['output']>;
  lockoutDuration: Scalars['Int']['output'];
  loginAlerts: Scalars['Boolean']['output'];
  maxLoginAttempts: Scalars['Int']['output'];
  passwordMinLength: Scalars['Int']['output'];
  passwordRequireNumbers: Scalars['Boolean']['output'];
  passwordRequireSpecialChars: Scalars['Boolean']['output'];
  passwordRequireUpperCase: Scalars['Boolean']['output'];
  sessionTimeout: Scalars['Int']['output'];
  twoFactorAuthRequired: Scalars['Boolean']['output'];
  twoFactorEnabled: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
};

export type SecuritySettingsInput = {
  lockoutDuration?: InputMaybe<Scalars['Int']['input']>;
  maxLoginAttempts?: InputMaybe<Scalars['Int']['input']>;
  passwordMinLength?: InputMaybe<Scalars['Int']['input']>;
  passwordRequireNumbers?: InputMaybe<Scalars['Boolean']['input']>;
  passwordRequireSpecialChars?: InputMaybe<Scalars['Boolean']['input']>;
  passwordRequireUpperCase?: InputMaybe<Scalars['Boolean']['input']>;
  sessionTimeout?: InputMaybe<Scalars['Int']['input']>;
  twoFactorAuthRequired?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SetReminderInput = {
  eventId: Scalars['ID']['input'];
  reminderDays: Scalars['Int']['input'];
};

export type SettingType =
  | 'APPLICATION'
  | 'EMAIL'
  | 'NOTIFICATION'
  | 'SECURITY'
  | 'STORAGE'
  | 'SYSTEM'
  | 'WORKFLOW';

export type SettingsPayload = {
  __typename?: 'SettingsPayload';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type SignInContent = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type SortingInput = {
  direction: SortDirection;
  field: UserSortField;
};

export type SubmitApplicationInput = {
  confirmConflictOfInterest: Scalars['Boolean']['input'];
  confirmEligibility: Scalars['Boolean']['input'];
  confirmLegalCompliance: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};

export type SubmitReportInput = {
  attachments?: InputMaybe<Array<Scalars['String']['input']>>;
  content: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type SupportingDocument = {
  __typename?: 'SupportingDocument';
  name: Scalars['String']['output'];
  type: DocumentType;
  uploadedAt: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type SupportingDocumentInput = {
  name: Scalars['String']['input'];
  type: DocumentType;
  url: Scalars['String']['input'];
};

export type SystemAnalytics = {
  __typename?: 'SystemAnalytics';
  activeModules: Array<ModuleUsage>;
  activeUsers: Scalars['Int']['output'];
  avgSessionDuration: Scalars['Int']['output'];
  loginActivity: Array<LoginActivityData>;
  uniqueLogins: Scalars['Int']['output'];
  userGrowth: Array<GrowthData>;
};

export type SystemHealth = {
  __typename?: 'SystemHealth';
  apiResponseTime: Scalars['Float']['output'];
  databaseHealth: Scalars['String']['output'];
  errorRate: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  storageHealth: Scalars['String']['output'];
  uptime: Scalars['Float']['output'];
};

export type SystemSettings = {
  __typename?: 'SystemSettings';
  dateFormat: Scalars['String']['output'];
  language: Scalars['String']['output'];
  maintenanceMessage?: Maybe<Scalars['String']['output']>;
  maintenanceMode: Scalars['Boolean']['output'];
  organizationLogo?: Maybe<Scalars['String']['output']>;
  organizationName: Scalars['String']['output'];
  primaryColor: Scalars['String']['output'];
  secondaryColor: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  updatedBy: User;
};

export type SystemSettingsInput = {
  dateFormat?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  maintenanceMessage?: InputMaybe<Scalars['String']['input']>;
  maintenanceMode?: InputMaybe<Scalars['Boolean']['input']>;
  organizationLogo?: InputMaybe<Scalars['String']['input']>;
  organizationName?: InputMaybe<Scalars['String']['input']>;
  primaryColor?: InputMaybe<Scalars['String']['input']>;
  secondaryColor?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type TopAward = {
  __typename?: 'TopAward';
  amount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  organizationName: Scalars['String']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float']['output'];
  approvedBy?: Maybe<User>;
  approvedDate?: Maybe<Scalars['String']['output']>;
  award?: Maybe<Award>;
  costCenter?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  reconciled: Scalars['Boolean']['output'];
  reconciliationNotes?: Maybe<Scalars['String']['output']>;
  requestedBy: User;
  status: TransactionStatus;
  transactionDate: Scalars['String']['output'];
  type: TransactionType;
  updatedAt: Scalars['String']['output'];
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  edges: Array<TransactionEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  cursor: Scalars['String']['output'];
  node: Transaction;
};

export type TransactionFilterInput = {
  awardId?: InputMaybe<Scalars['ID']['input']>;
  costCenter?: InputMaybe<Scalars['String']['input']>;
  dateRange?: InputMaybe<DateRangeInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<TransactionStatus>>;
  types?: InputMaybe<Array<TransactionType>>;
};

export type TransactionMetrics = {
  __typename?: 'TransactionMetrics';
  approvedTransactions: Scalars['Int']['output'];
  averageApprovalTime: Scalars['Float']['output'];
  pendingTransactions: Scalars['Int']['output'];
  rejectedTransactions: Scalars['Int']['output'];
  totalTransactions: Scalars['Int']['output'];
};

export type TransactionStatus =
  | 'APPROVED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'PENDING'
  | 'PROCESSED'
  | 'REJECTED';

export type TransactionType =
  | 'ADJUSTMENT'
  | 'DISBURSEMENT'
  | 'EXPENSE'
  | 'REFUND'
  | 'REVENUE';

export type TrendData = {
  __typename?: 'TrendData';
  date: Scalars['String']['output'];
  percentage?: Maybe<Scalars['Float']['output']>;
  value: Scalars['Int']['output'];
};

export type UpcomingDeadline = {
  __typename?: 'UpcomingDeadline';
  daysUntilDue: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  type: FinanceEventType;
  urgency: Scalars['String']['output'];
};

export type UpdateAccountSettingsInput = {
  language?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateApplicationInput = {
  additionalInfoProvided?: InputMaybe<Scalars['Boolean']['input']>;
  additionalNotes?: InputMaybe<Scalars['String']['input']>;
  availableForInterview?: InputMaybe<Scalars['Boolean']['input']>;
  budgetBreakdown?: InputMaybe<Array<BudgetItemInput>>;
  budgetJustification?: InputMaybe<Scalars['String']['input']>;
  conflictOfInterestDeclared?: InputMaybe<Scalars['Boolean']['input']>;
  conflictOfInterestDetails?: InputMaybe<Scalars['String']['input']>;
  eligibilityResponses?: InputMaybe<Array<EligibilityResponseInput>>;
  ethicsApprovalNumber?: InputMaybe<Scalars['String']['input']>;
  ethicsApprovalRequired?: InputMaybe<Scalars['Boolean']['input']>;
  ethicsApprovalStatus?: InputMaybe<Scalars['String']['input']>;
  expectedOutcomes?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  interviewDates?: InputMaybe<Array<Scalars['String']['input']>>;
  legalComplianceConfirmed?: InputMaybe<Scalars['Boolean']['input']>;
  projectDuration?: InputMaybe<Scalars['Int']['input']>;
  projectMethodology?: InputMaybe<Scalars['String']['input']>;
  projectObjectives?: InputMaybe<Scalars['String']['input']>;
  projectSummary?: InputMaybe<Scalars['String']['input']>;
  projectTitle?: InputMaybe<Scalars['String']['input']>;
  requestedAmount?: InputMaybe<Scalars['Float']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  supportingDocuments?: InputMaybe<Array<SupportingDocumentInput>>;
};

export type UpdateApplicationStatusInput = {
  id: Scalars['ID']['input'];
  reviewNotes?: InputMaybe<Scalars['String']['input']>;
  status: ApplicationStatus;
};

export type UpdateAwardInput = {
  awardedAmount?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBudgetInput = {
  allocatedBudget?: InputMaybe<Scalars['Float']['input']>;
  costCenter?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  utilizedBudget?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateCalendarEventInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventInput = {
  attendeeIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  reminder?: InputMaybe<Scalars['Boolean']['input']>;
  reminderMinutes?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFinanceEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  location?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFinancialPreferencesInput = {
  autoApprovalLimit?: InputMaybe<Scalars['Float']['input']>;
  defaultCurrency?: InputMaybe<Scalars['String']['input']>;
  defaultFiscalYear?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFundingAllocationInput = {
  allocations: Array<AllocationInput>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  awardId: Scalars['ID']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type UpdateFundingCallInput = {
  allowsMultipleApplications?: InputMaybe<MultipleApplicationsAllowed>;
  description?: InputMaybe<Scalars['String']['input']>;
  eligibility?: InputMaybe<Array<Scalars['String']['input']>>;
  funder?: InputMaybe<Scalars['String']['input']>;
  hasMinMaxAward?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  maximumAward?: InputMaybe<Scalars['Float']['input']>;
  minimumAward?: InputMaybe<Scalars['Float']['input']>;
  openDate?: InputMaybe<Scalars['String']['input']>;
  originalCallLink?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Scalars['String']['input']>;
  totalAvailable?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateMilestoneInput = {
  completionPercentage?: InputMaybe<Scalars['Int']['input']>;
  deliverables?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNotificationPreferenceInput = {
  category: NotificationCategory;
  dashboardEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  emailEnabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  officeLocation?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProposalInput = {
  abstract?: InputMaybe<Scalars['String']['input']>;
  requestedAmount?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReportInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReportingPreferencesInput = {
  autoGenerateReports?: InputMaybe<Scalars['Boolean']['input']>;
  exportFormat?: InputMaybe<Scalars['String']['input']>;
  reportingFrequency?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateResearcherProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phoneContact?: InputMaybe<Scalars['String']['input']>;
  researchInterests?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateUserContent = {
  account_type?: InputMaybe<Account_Type>;
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  phone_contact?: InputMaybe<Scalars['String']['input']>;
  staffid?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  department?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phoneContact?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
  staffId?: InputMaybe<Scalars['String']['input']>;
};

export type UploadProfileImageInput = {
  fileName: Scalars['String']['input'];
  fileUrl: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  assignedResearcher?: Maybe<User>;
  assignedResearcherId?: Maybe<Scalars['ID']['output']>;
  authUserId?: Maybe<Scalars['ID']['output']>;
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  guests?: Maybe<Array<User>>;
  id?: Maybe<Scalars['ID']['output']>;
  lastLogin?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phoneContact?: Maybe<Scalars['String']['output']>;
  role?: Maybe<UserRole>;
  staffId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<UserStatus>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type UserAnalytics = {
  __typename?: 'UserAnalytics';
  activeUsers: Scalars['Int']['output'];
  administrators: Scalars['Int']['output'];
  financeOfficers: Scalars['Int']['output'];
  guests: Scalars['Int']['output'];
  inactiveUsers: Scalars['Int']['output'];
  newUsersThisMonth: Scalars['Int']['output'];
  newUsersThisYear: Scalars['Int']['output'];
  researchers: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type UserFilterInput = {
  department?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<UserRole>>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<UserStatus>;
};

export type UserRole =
  | 'admin'
  | 'director'
  | 'finance_officer'
  | 'guest'
  | 'researcher';

export type UserRoleCount = {
  __typename?: 'UserRoleCount';
  count: Scalars['Int']['output'];
  role: UserRole;
};

export type UserRoleDistribution = {
  __typename?: 'UserRoleDistribution';
  count: Scalars['Int']['output'];
  percentage: Scalars['Float']['output'];
  role: Scalars['String']['output'];
};

export type UserSortField =
  | 'DEPARTMENT'
  | 'EMAIL'
  | 'JOINED'
  | 'NAME'
  | 'ROLE'
  | 'STATUS';

export type UserStatus =
  | 'active'
  | 'inactive'
  | 'suspended';

export type UserStatusCount = {
  __typename?: 'UserStatusCount';
  count: Scalars['Int']['output'];
  status: UserStatus;
};

export type UserStatusInput = {
  status: UserStatus;
  userId: Scalars['ID']['input'];
};

export type UsersConnection = {
  __typename?: 'UsersConnection';
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
  users: Array<User>;
};

export type GetAdminFilter = {
  adminId?: InputMaybe<Scalars['ID']['input']>;
  authUserId?: InputMaybe<Scalars['ID']['input']>;
};

export type GetUserFilter = {
  account_type?: InputMaybe<Account_Type>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};
