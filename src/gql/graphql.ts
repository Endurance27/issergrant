/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Account_Type =
  | 'admin'
  | 'director'
  | 'finance_officer'
  | 'guest'
  | 'researcher';

export type AuditLogFilterInput = {
  action?: string | null | undefined;
  fromDate?: string | null | undefined;
  module?: string | null | undefined;
  toDate?: string | null | undefined;
  userId?: string | number | null | undefined;
};

export type AuditLogPaginationInput = {
  limit?: number | null | undefined;
  offset?: number | null | undefined;
};

export type CreateFundingCallInput = {
  allowsMultipleApplications: MultipleApplicationsAllowed;
  createdBy: string | number;
  description?: string | null | undefined;
  eligibility?: Array<string> | null | undefined;
  funder: string;
  hasMinMaxAward: boolean;
  maximumAward: number;
  minimumAward?: number | null | undefined;
  openDate: string;
  originalCallLink?: string | null | undefined;
  theme?: string | null | undefined;
  totalAvailable: number;
};

export type CreateProposalInput = {
  abstract: string;
  coPiIds?: Array<string | number> | null | undefined;
  department?: string | null | undefined;
  fundingCallId: string | number;
  requestedAmount?: number | null | undefined;
  title: string;
  userID: string | number;
};

export type CreateUserInput = {
  department?: string | null | undefined;
  email: string;
  name: string;
  phoneContact?: string | null | undefined;
  role: UserRole;
  staffId?: string | null | undefined;
};

export type GetFundingCallFilter = {
  createdBy?: string | number | null | undefined;
  funder?: string | null | undefined;
  id?: string | number | null | undefined;
  theme?: string | null | undefined;
};

export type MultipleApplicationsAllowed =
  | 'no'
  | 'yes';

export type ProposalStatus =
  | 'approved'
  | 'archived'
  | 'draft'
  | 'funded'
  | 'rejected'
  | 'submitted'
  | 'under_review';

export type SignInContent = {
  email: string;
  password: string;
};

export type SortDirection =
  | 'ASC'
  | 'DESC';

export type UpdateFundingCallInput = {
  allowsMultipleApplications?: MultipleApplicationsAllowed | null | undefined;
  description?: string | null | undefined;
  eligibility?: Array<string> | null | undefined;
  funder?: string | null | undefined;
  hasMinMaxAward?: boolean | null | undefined;
  id: string | number;
  maximumAward?: number | null | undefined;
  minimumAward?: number | null | undefined;
  openDate?: string | null | undefined;
  originalCallLink?: string | null | undefined;
  theme?: string | null | undefined;
  totalAvailable?: number | null | undefined;
};

export type UpdateProposalInput = {
  abstract?: string | null | undefined;
  department?: string | null | undefined;
  requestedAmount?: number | null | undefined;
  title?: string | null | undefined;
};

export type UpdateUserInput = {
  department?: string | null | undefined;
  email?: string | null | undefined;
  id: string | number;
  name?: string | null | undefined;
  phoneContact?: string | null | undefined;
  role?: UserRole | null | undefined;
  staffId?: string | null | undefined;
};

export type UserRole =
  | 'admin'
  | 'director'
  | 'finance_officer'
  | 'guest'
  | 'researcher';

export type UserStatus =
  | 'active'
  | 'inactive'
  | 'suspended';

export type UserStatusInput = {
  status: UserStatus;
  userId: string | number;
};

export type UserFieldsFragment = { id: string | null, authUserId: string | null, name: string | null, email: string | null, role: UserRole | null, status: UserStatus | null, department: string | null, staffId: string | null, phoneContact: string | null, avatar: string | null, lastLogin: string | null, createdAt: string | null, updatedAt: string | null } & { ' $fragmentName'?: 'UserFieldsFragment' };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;


export type CreateUserMutation = { createUser: { temporaryPassword: string, user: { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } } } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { updateUser: { ' $fragmentRefs'?: { 'UserFieldsFragment': UserFieldsFragment } } | null };

export type UpdateUserStatusMutationVariables = Exact<{
  input: UserStatusInput;
}>;


export type UpdateUserStatusMutation = { updateUserStatus: { id: string | null, status: UserStatus | null } | null };

export type SignInMutationVariables = Exact<{
  content?: SignInContent | null | undefined;
}>;


export type SignInMutation = { signIn: { accessToken: string | null, account_type: Account_Type | null, email: string | null, id: string | null, user: { id: string | null, authUserId: string | null, name: string | null, email: string | null, role: UserRole | null, status: UserStatus | null, department: string | null, staffId: string | null, phoneContact: string | null, avatar: string | null, lastLogin: string | null, createdAt: string | null, updatedAt: string | null } | null } | null };

export type BookmarkGrantCallMutationVariables = Exact<{
  fundingCallId: string | number;
  userID: string | number;
  notes?: string | null | undefined;
}>;


export type BookmarkGrantCallMutation = { bookmarkGrantCall: { success: boolean, message: string, grantCall: { id: string, title: string, description: string | null, category: string, totalBudget: number, deadline: string, eligibility: string | null, status: string, applicationCount: number, isBookmarked: boolean, bookmarkNotes: string | null } | null, bookmark: { id: string, userID: string, fundingCallId: string, fundingCallTitle: string, notes: string | null, bookmarkedAt: string } | null } };

export type CreateFundingCallMutationVariables = Exact<{
  content: CreateFundingCallInput;
}>;


export type CreateFundingCallMutation = { createFundingCall: { id: string, funder: string, theme: string | null, totalAvailable: number, maximumAward: number, minimumAward: number | null, hasMinMaxAward: boolean, allowsMultipleApplications: MultipleApplicationsAllowed, openDate: string, originalCallLink: string | null, eligibility: Array<string> | null, createdBy: string } };

export type UpdateFundingCallMutationVariables = Exact<{
  content: UpdateFundingCallInput;
}>;


export type UpdateFundingCallMutation = { updateFundingCall: { id: string, funder: string, totalAvailable: number, maximumAward: number, theme: string | null, description: string | null, hasMinMaxAward: boolean, minimumAward: number | null, allowsMultipleApplications: MultipleApplicationsAllowed, openDate: string, originalCallLink: string | null, eligibility: Array<string> | null, createdBy: string, createdAt: string | null, updatedAt: string | null } };

export type ProposalFieldsFragment = { id: string, title: string, abstract: string | null, status: ProposalStatus, requestedAmount: number | null, department: string | null, submitted: string, user: { id: string | null, authUserId: string | null, name: string | null, email: string | null, role: UserRole | null, status: UserStatus | null, department: string | null, staffId: string | null, phoneContact: string | null, avatar: string | null, lastLogin: string | null, createdAt: string | null, updatedAt: string | null } | null, coPIs: Array<{ id: string | null, name: string | null, email: string | null, department: string | null }> | null, fundingCall: { id: string, funder: string, totalAvailable: number, maximumAward: number, theme: string | null, description: string | null, hasMinMaxAward: boolean, minimumAward: number | null, allowsMultipleApplications: MultipleApplicationsAllowed, openDate: string, originalCallLink: string | null, eligibility: Array<string> | null, createdBy: string, createdAt: string | null, updatedAt: string | null } | null } & { ' $fragmentName'?: 'ProposalFieldsFragment' };

export type CreateProposalMutationVariables = Exact<{
  input: CreateProposalInput;
}>;


export type CreateProposalMutation = { createProposal: { success: boolean, message: string, errors: Array<string> | null, proposal: { ' $fragmentRefs'?: { 'ProposalFieldsFragment': ProposalFieldsFragment } } | null } };

export type UpdateProposalMutationVariables = Exact<{
  id: string;
  input: UpdateProposalInput;
}>;


export type UpdateProposalMutation = { updateProposal: { success: boolean, message: string, errors: Array<string> | null, proposal: { ' $fragmentRefs'?: { 'ProposalFieldsFragment': ProposalFieldsFragment } } | null } };

export type RemoveProposalCoPiMutationVariables = Exact<{
  proposalId: string | number;
  userId: string | number;
}>;


export type RemoveProposalCoPiMutation = { removeProposalCoPi: { success: boolean, message: string, errors: Array<string> | null, proposal: { ' $fragmentRefs'?: { 'ProposalFieldsFragment': ProposalFieldsFragment } } | null } };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { getUsers: { totalCount: number, users: Array<{ id: string | null, authUserId: string | null, name: string | null, email: string | null, role: UserRole | null, status: UserStatus | null, department: string | null, staffId: string | null, phoneContact: string | null, avatar: string | null, lastLogin: string | null, createdAt: string | null, updatedAt: string | null }> } };

export type GetFundingCallsQueryVariables = Exact<{
  filter?: GetFundingCallFilter | null | undefined;
}>;


export type GetFundingCallsQuery = { getFundingCalls: Array<{ id: string, allowsMultipleApplications: MultipleApplicationsAllowed, eligibility: Array<string> | null, description: string | null, originalCallLink: string | null, theme: string | null, totalAvailable: number, createdBy: string, funder: string, hasMinMaxAward: boolean, maximumAward: number, minimumAward: number | null, openDate: string }> };

export type AuditLogsQueryVariables = Exact<{
  filter?: AuditLogFilterInput | null | undefined;
  pagination?: AuditLogPaginationInput | null | undefined;
  sortDirection?: SortDirection | null | undefined;
}>;


export type AuditLogsQuery = { auditLogs: { totalCount: number, logs: Array<{ id: string, userId: string, action: string, module: string, details: string | null, ipAddress: string | null, userAgent: string | null, createdAt: string, updatedAt: string, user: { id: string | null, authUserId: string | null, name: string | null, email: string | null, role: UserRole | null, status: UserStatus | null, department: string | null, staffId: string | null, phoneContact: string | null, avatar: string | null, lastLogin: string | null, createdAt: string | null, updatedAt: string | null } | null }>, pageInfo: { hasNextPage: boolean, hasPreviousPage: boolean, startCursor: string | null, endCursor: string | null, currentPage: number | null, totalPages: number | null } } };

export type AuditMetricsQueryVariables = Exact<{ [key: string]: never; }>;


export type AuditMetricsQuery = { auditMetrics: { totalAudits: number, issuesFound: number, openFindings: number, complianceRate: number } };

export const UserFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UserFieldsFragment, unknown>;
export const ProposalFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coPIs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"department"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundingCall"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"funder"}},{"kind":"Field","name":{"kind":"Name","value":"totalAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAward"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"hasMinMaxAward"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAward"}},{"kind":"Field","name":{"kind":"Name","value":"allowsMultipleApplications"}},{"kind":"Field","name":{"kind":"Name","value":"openDate"}},{"kind":"Field","name":{"kind":"Name","value":"originalCallLink"}},{"kind":"Field","name":{"kind":"Name","value":"eligibility"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ProposalFieldsFragment, unknown>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"temporaryPassword"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UpdateUserStatusMutation, UpdateUserStatusMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInContent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"account_type"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const BookmarkGrantCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BookmarkGrantCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fundingCallId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookmarkGrantCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fundingCallId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fundingCallId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"grantCall"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"totalBudget"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"eligibility"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"applicationCount"}},{"kind":"Field","name":{"kind":"Name","value":"isBookmarked"}},{"kind":"Field","name":{"kind":"Name","value":"bookmarkNotes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bookmark"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userID"}},{"kind":"Field","name":{"kind":"Name","value":"fundingCallId"}},{"kind":"Field","name":{"kind":"Name","value":"fundingCallTitle"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"bookmarkedAt"}}]}}]}}]}}]} as unknown as DocumentNode<BookmarkGrantCallMutation, BookmarkGrantCallMutationVariables>;
export const CreateFundingCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFundingCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFundingCallInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFundingCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"funder"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"totalAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAward"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAward"}},{"kind":"Field","name":{"kind":"Name","value":"hasMinMaxAward"}},{"kind":"Field","name":{"kind":"Name","value":"allowsMultipleApplications"}},{"kind":"Field","name":{"kind":"Name","value":"openDate"}},{"kind":"Field","name":{"kind":"Name","value":"originalCallLink"}},{"kind":"Field","name":{"kind":"Name","value":"eligibility"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}}]}}]}}]} as unknown as DocumentNode<CreateFundingCallMutation, CreateFundingCallMutationVariables>;
export const UpdateFundingCallDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFundingCall"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateFundingCallInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFundingCall"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"funder"}},{"kind":"Field","name":{"kind":"Name","value":"totalAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAward"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"hasMinMaxAward"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAward"}},{"kind":"Field","name":{"kind":"Name","value":"allowsMultipleApplications"}},{"kind":"Field","name":{"kind":"Name","value":"openDate"}},{"kind":"Field","name":{"kind":"Name","value":"originalCallLink"}},{"kind":"Field","name":{"kind":"Name","value":"eligibility"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateFundingCallMutation, UpdateFundingCallMutationVariables>;
export const CreateProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProposalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coPIs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"department"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundingCall"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"funder"}},{"kind":"Field","name":{"kind":"Name","value":"totalAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAward"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"hasMinMaxAward"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAward"}},{"kind":"Field","name":{"kind":"Name","value":"allowsMultipleApplications"}},{"kind":"Field","name":{"kind":"Name","value":"openDate"}},{"kind":"Field","name":{"kind":"Name","value":"originalCallLink"}},{"kind":"Field","name":{"kind":"Name","value":"eligibility"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateProposalMutation, CreateProposalMutationVariables>;
export const UpdateProposalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProposal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProposalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProposal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coPIs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"department"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundingCall"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"funder"}},{"kind":"Field","name":{"kind":"Name","value":"totalAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAward"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"hasMinMaxAward"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAward"}},{"kind":"Field","name":{"kind":"Name","value":"allowsMultipleApplications"}},{"kind":"Field","name":{"kind":"Name","value":"openDate"}},{"kind":"Field","name":{"kind":"Name","value":"originalCallLink"}},{"kind":"Field","name":{"kind":"Name","value":"eligibility"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateProposalMutation, UpdateProposalMutationVariables>;
export const RemoveProposalCoPiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveProposalCoPi"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"proposalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeProposalCoPi"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"proposalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"proposalId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"proposal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProposalFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProposalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Proposal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"submitted"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coPIs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"department"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundingCall"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"funder"}},{"kind":"Field","name":{"kind":"Name","value":"totalAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAward"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"hasMinMaxAward"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAward"}},{"kind":"Field","name":{"kind":"Name","value":"allowsMultipleApplications"}},{"kind":"Field","name":{"kind":"Name","value":"openDate"}},{"kind":"Field","name":{"kind":"Name","value":"originalCallLink"}},{"kind":"Field","name":{"kind":"Name","value":"eligibility"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RemoveProposalCoPiMutation, RemoveProposalCoPiMutationVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetFundingCallsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFundingCalls"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GetFundingCallFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFundingCalls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"allowsMultipleApplications"}},{"kind":"Field","name":{"kind":"Name","value":"eligibility"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"originalCallLink"}},{"kind":"Field","name":{"kind":"Name","value":"theme"}},{"kind":"Field","name":{"kind":"Name","value":"totalAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"funder"}},{"kind":"Field","name":{"kind":"Name","value":"hasMinMaxAward"}},{"kind":"Field","name":{"kind":"Name","value":"maximumAward"}},{"kind":"Field","name":{"kind":"Name","value":"minimumAward"}},{"kind":"Field","name":{"kind":"Name","value":"openDate"}}]}}]}}]} as unknown as DocumentNode<GetFundingCallsQuery, GetFundingCallsQueryVariables>;
export const AuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditLogFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditLogPaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"module"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authUserId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"department"}},{"kind":"Field","name":{"kind":"Name","value":"staffId"}},{"kind":"Field","name":{"kind":"Name","value":"phoneContact"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"lastLogin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}}]}}]}}]}}]} as unknown as DocumentNode<AuditLogsQuery, AuditLogsQueryVariables>;
export const AuditMetricsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditMetrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditMetrics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalAudits"}},{"kind":"Field","name":{"kind":"Name","value":"issuesFound"}},{"kind":"Field","name":{"kind":"Name","value":"openFindings"}},{"kind":"Field","name":{"kind":"Name","value":"complianceRate"}}]}}]}}]} as unknown as DocumentNode<AuditMetricsQuery, AuditMetricsQueryVariables>;