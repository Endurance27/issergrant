export interface CreateAssistantResearcherInput {
  name: string
  email: string
  department: string
  role: 'assistant_researcher'
  phoneContact: string
  staffId: string
  assignedTo: string
  notes?: string | null
  resourceId: string
  assignmentType: 'proposal'
  resourceTitle: string
}

export interface AssistantResearcher {
  id: string
  authUserId: string
  name: string
  email: string
  role: string
  department: string
  staffId: string
  phoneContact: string
  avatar?: string | null
  lastLogin?: string | null
  createdAt: string
  updatedAt: string
}

export interface SignUpAssistantResearcherResponse {
  signUpAssistantResearcher: AssistantResearcher
}
