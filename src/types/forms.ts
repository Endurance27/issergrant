export interface LoginFormValues { email: string; password: string }
export interface CreateUserFormValues { name: string; email: string; role: string; department: string; staffId: string; phoneContact: string }
export interface GrantCallFormValues { title: string; deadline: string; category: string; totalBudget: number; description: string; eligibility: string }
export interface ProposalFormValues { title: string; grantCallId: string; requestedAmount: number; department: string; abstract: string }
export interface MilestoneFormValues { title: string; dueDate: string; description: string }
export interface ProfileFormValues { name: string; email: string; department: string }
