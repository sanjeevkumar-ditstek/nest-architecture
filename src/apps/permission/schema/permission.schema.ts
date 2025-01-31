import * as yup from 'yup';

export const createPermissionSchema = yup.object().shape({
  action: yup.string().required('action is requied'),
  module: yup.string().required('module is requied'),
});

export const assignPermissionSchema = yup.object().shape({
  userId: yup.string().required('user Id is requied'),
  roleId: yup.string().required('role Id is requied'),
  permissionId: yup.string().required('permission Id is requied'),
});
