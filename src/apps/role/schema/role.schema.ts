import * as yup from 'yup';

export const createRoleSchema = yup.object().shape({
  role: yup.string().required(),
  level: yup.number().required(),
});
