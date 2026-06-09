import * as Yup from 'yup'
export const milestoneSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  dueDate: Yup.string().required('Due date is required'),
  description: Yup.string().required('Description is required'),
})
