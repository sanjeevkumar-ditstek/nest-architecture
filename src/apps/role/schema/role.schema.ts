import * as yup from 'yup';

export const createRoleSchema = yup.object().shape({
  role: yup.string().required(),
  level: yup.number().required(),
});

export const updateRoleSchema = yup.object().shape({
  role: yup.string().required(),
  level: yup.number().required(),
});

export const deleteRoleSchema = yup.object().shape({
  id: yup.string().required(),
});
