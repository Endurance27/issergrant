import * as Yup from 'yup'
export const proposalSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  grantCallId: Yup.string().required('Grant call is required'),
  requestedAmount: Yup.number().positive('Must be positive').required('Amount is required'),
  department: Yup.string().required('Department is required'),
  abstract: Yup.string().min(50, 'Abstract must be at least 50 characters').required('Abstract is required'),
})
