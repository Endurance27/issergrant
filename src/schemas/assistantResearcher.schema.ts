import * as Yup from 'yup'

export const assistantResearcherSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  department: Yup.string().required('Department is required'),
  phoneContact: Yup.string().required('Phone contact is required'),
  staffId: Yup.string().required('Staff ID is required'),
  resourceId: Yup.string().required('Resource ID is required'),
  resourceTitle: Yup.string().required('Resource title is required'),
  assignmentType: Yup.string().oneOf(['proposal']).required('Assignment type is required'),
  notes: Yup.string().nullable().optional(),
})
