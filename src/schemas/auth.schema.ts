import * as Yup from 'yup';
export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(4, 'Password must be at least 6 characters')
    .required('Password is required'),
});
