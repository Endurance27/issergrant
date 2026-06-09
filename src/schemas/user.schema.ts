import * as Yup from 'yup'
export const createUserSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  role: Yup.string().required('Role is required'),
  department: Yup.string().required('Department is required'),
  staffId: Yup.string().required('Staff ID is required'),
  phoneContact: Yup.string().required('Phone contact is required'),
})
