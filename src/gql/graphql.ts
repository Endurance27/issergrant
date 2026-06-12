// Domain interfaces

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  joined: string;
  avatar?: string;
}

export interface GrantCall {
  id: string;
  title: string;
  deadline: string;
  totalBudget: number;
  applications: number;
  status: string;
  category: string;
  description: string;
  eligibility: string;
}

export interface Proposal {
  id: string;
  title: string;
  researcher: string;
  grantCallId: string;
  status: string;
  requestedAmount: number;
  department: string;
}

export interface Award {
  id: string;
  title: string;
  researcher: string;
  awardedAmount: number;
  status: string;
}

export interface Milestone {
  id: string;
  title: string;
  projectTitle: string;
  dueDate: string;
  status: string;
  researcher: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  description: string;
}

// Query variable types

export interface UsersQueryVariables {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
}

export interface GrantCallsQueryVariables {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
}

export interface ProposalsQueryVariables {
  page?: number;
  limit?: number;
  status?: string;
  grantCallId?: string;
}

export interface AwardsQueryVariables {
  page?: number;
  limit?: number;
  status?: string;
}

export interface MilestonesQueryVariables {
  page?: number;
  limit?: number;
  status?: string;
}

export interface TransactionsQueryVariables {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}

// Mutation variable types

export interface CreateUserVariables {
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface UpdateUserVariables {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  department?: string;
}

export interface SignInContent {
  email: string;
  password: string;
}

export interface SignInVariables {
  content: SignInContent;
}

export interface AuthUser {
  id: string;
  email: string;
  accessToken: string;
  account_type: UserRoleEnum;
}

export interface SignInResponse {
  signIn: AuthUser;
}

export interface CreateProposalVariables {
  title: string;
  grantCallId: string;
  requestedAmount: number;
  department: string;
}

export interface UpdateProposalVariables {
  id: string;
  status?: string;
  requestedAmount?: number;
}

// Frontend display roles
export type UserRole = 'Admin' | 'Researcher' | 'Assistant Researcher' | 'Finance Officer' | 'Director'

// Backend GraphQL enum values (lowercase)
export type UserRoleEnum = 'admin' | 'researcher' | 'assistant_researcher' | 'finance_officer' | 'director'

export interface CreateUserInput {
  name: string
  email: string
  role: UserRoleEnum
  department: string
  staffId: string
  phoneContact: string
}

export interface CreateUserResponse {
  createUser: {
    temporaryPassword: string
    user: {
      id: string
      authUserId: string
      avatar?: string
      lastLogin?: string
    }
  }
}
