import * as Yup from 'yup'

export const updateFundingCallSchema = Yup.object({
  id: Yup.string().required('Funding call ID is required'),

  funder: Yup.string().trim().nullable().optional(),

  totalAvailable: Yup.number()
    .typeError('Must be a number')
    .positive('Must be greater than 0')
    .nullable()
    .optional(),

  maximumAward: Yup.number()
    .typeError('Must be a number')
    .positive('Must be greater than 0')
    .nullable()
    .optional(),

  theme: Yup.string().trim().nullable().optional(),

  description: Yup.string().trim().nullable().optional(),

  hasMinMaxAward: Yup.boolean().optional(),

  minimumAward: Yup.number()
    .typeError('Must be a number')
    .nullable()
    .when('hasMinMaxAward', {
      is: true,
      then: schema =>
        schema
          .positive('Must be greater than 0')
          .required('Minimum award is required when min/max is enabled')
          .test(
            'min-lte-max',
            'Minimum award must be less than or equal to maximum award',
            function (value) {
              const { maximumAward } = this.parent
              if (value == null || maximumAward == null) return true
              return value <= maximumAward
            }
          ),
      otherwise: schema => schema.nullable().optional(),
    }),

  allowsMultipleApplications: Yup.string()
    .oneOf(['yes', 'no'], 'Must be "yes" or "no"')
    .optional(),

  openDate: Yup.string().nullable().optional(),

  originalCallLink: Yup.string()
    .url('Must be a valid URL (include https://)')
    .nullable()
    .optional(),

  eligibility: Yup.array()
    .of(Yup.string().trim().required('Criterion cannot be empty'))
    .nullable()
    .optional(),
})
