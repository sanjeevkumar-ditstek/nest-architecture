import * as yup from 'yup';

export const createPermissionSchema = yup.object().shape({
  action: yup.string().required('action is requied'),
  module: yup.string().required('module is requied'),
});

export const updatePermissionSchema = yup.object().shape({
  action: yup.string().required('action is requied'),
  module: yup.string().required('module is requied'),
});
