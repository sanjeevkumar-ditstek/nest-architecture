import * as yup from 'yup';

export const createSchema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().optional(),
  userName: yup.string().optional(),
  role: yup.string().optional(),
  level: yup.number().optional(),
  action: yup.string().optional(),
  module: yup.string().optional(),
});

export const updateSchema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().optional(),
  userName: yup.string().optional(),
  role: yup.string().optional(),
  level: yup.number().optional(),
  action: yup.string().optional(),
  module: yup.string().optional(),
});
