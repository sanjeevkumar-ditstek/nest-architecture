import * as yup from 'yup';

export const createSchema = yup.object().shape({
  userName: yup.string().required('User name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
});
export const sendEmailSchema = yup.object({
  to: yup.string().email().required(),
  subject: yup.string().required(),
  text: yup.string().required(),
  attachments: yup.array().optional(),
});
