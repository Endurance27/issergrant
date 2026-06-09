import * as Yup from 'yup'
export const grantCallSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  deadline: Yup.string().required('Deadline is required'),
  category: Yup.string().required('Category is required'),
  totalBudget: Yup.number().positive('Must be positive').required('Budget is required'),
  description: Yup.string().required('Description is required'),
  eligibility: Yup.string().required('Eligibility is required'),
})
