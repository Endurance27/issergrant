import * as Yup from 'yup'

export const createFundingCallSchema = Yup.object({
  funder: Yup.string().trim().required('Funder name is required'),
  totalAvailable: Yup.number()
    .typeError('Must be a number')
    .positive('Must be positive')
    .required('Total available amount is required'),
  maximumAward: Yup.number()
    .typeError('Must be a number')
    .positive('Must be positive')
    .required('Maximum award is required'),
  theme: Yup.string().trim().required('Theme is required'),
  description: Yup.string().trim().required('Description is required'),
  hasMinMaxAward: Yup.boolean().required(),
  minimumAward: Yup.number()
    .typeError('Must be a number')
    .when('hasMinMaxAward', {
      is: true,
      then: schema => schema.positive('Must be positive').required('Minimum award is required when min/max is enabled'),
      otherwise: schema => schema.optional(),
    }),
  allowsMultipleApplications: Yup.string()
    .oneOf(['yes', 'no'], 'Please select an option')
    .required('This field is required'),
  openDate: Yup.string().required('Open date is required'),
  originalCallLink: Yup.string().url('Must be a valid URL').required('Original call link is required'),
  eligibility: Yup.array()
    .of(Yup.string().trim().required('Eligibility item cannot be empty'))
    .min(1, 'At least one eligibility criterion is required')
    .required(),
})
