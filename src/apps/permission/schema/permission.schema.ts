import * as yup from 'yup';

export const createPermissionSchema = yup.object().shape({
  action: yup.string().required('action is requied'),
  module: yup.string().required('module is requied'),
});

export const updatePermissionSchema = yup.object().shape({
  action: yup.string().required('action is requied'),
  module: yup.string().required('module is requied'),
});

export const deletePermissionSchema = yup.object().shape({
  id: yup.string().required(),
});

export const assignPermissionSchema = yup.object().shape({
  userId: yup.string().required('user Id is requied'),
  roleId: yup.string().required('role Id is requied'),
  permissionId: yup.string().required('permission Id is requied'),
});

export const updateAssignPermissionSchema = yup.object().shape({
  userId: yup.string().required('user Id is requied'),
  roleId: yup.string().required('role Id is requied'),
  permissionId: yup.string().required('permission Id is requied'),
});

export const deleteAssignPermissionSchema = yup.object().shape({
  id: yup.string().required(),
});
