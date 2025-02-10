enum ResponseMessage {
  PERMISSION_CREATED = 'Permission created successfully',
  USER_CREATED = 'User created successfully',
  ROLE_CREATED = 'Role created successfully',
  User_PERMISSION_CREATED = 'user permission created successfully',

  PERMISSION_UPDATED = 'Permission updated successfully.',
  USER_UPDATED = 'User updated successfully.',
  ROLE_UPDATED = 'Role updated successfully.',
  USER_PERMISSION_UPDATED = ' User permission updated successfully.',

  USER_SOFT_DELETED = 'User soft deleted successfully.',
  PERMISSION_SOFT_DELETED = 'Permission soft deleted.',
  ROLE_SOFT_DELETED = 'Role soft deleted successfully.',
  USER_PERMISSION_SOFT_DELETED = 'User permission soft deleted successfully.',

  GET_USER = 'User retrieved successfully',
  GET_ROLE = 'Role retrieved successfully',
  GET_PERMISSION = '',
  GET_USER_PERMISSION = 'Permission retrieved successfully',

  GET_USERS = 'Users fetched successfully',
  GET_PERMISSIONS = 'Permissions fetched successfully',
  GET_ROLES = 'Roles fetched successfully',

  UNAUTHORIZED = 'Unauthorized',
  USER_LOGGED_IN = 'User logged in successfully',

  PERMISSION_IN_USE = 'User is link with this permission.',
  ROLE_IN_USE = 'User is link with this role.',

  USER_REGISTRATION_ERROR = 'Error in registering user.',
  INVALID_CREDENTIALS = 'Invalid credentials.',
  USER_EXISTS = 'User already exists.',
  BAD_REQUEST = 'Bad request.',
  FAILED_TO_UPDATE_USER = 'Failed to update user.',
  FAILED_TO_LOGIN_USER = 'Failed to login. Please check your credentials and try again.',
  USER_ALREADY_EXISTS = 'User with the provided email already exists.',
  USER_NOT_FOUND = 'User not found.',

  SOFT_DELETED = 'Soft deleted successfully',
  FAILED_TO_SOFT_DELETE = 'Failed to soft delete',

  USERS_FETCHED = 'Users fetched successfully',
  FAILED_TO_FETCH_USERS = 'Failed to fetch users',
  FAILED_TO_FETCH_PERMISSIONS = 'Failed to fetch permissions',
  FAILED_TO_FETCH_ROLES = 'Failed to fetch roles',

  ROLE_NOT_FOUND = 'Role not found',
  PERMISSION_NOT_FOUND = 'Permission not found',
  USER_ROLE_NOT_FOUND = 'User role not found',

  FAILED_TO_UPDATE_USER_ROLE = 'Failed to update roles',
  PERMISSION_ALREADY_EXISTS = 'Permission already exists',
  FAILED_TO_CREATE_PERMISSIONS = 'Failed to create permissions',
  FAILED_TO_UPDATE_PERMISSION = 'Failed to update permission',

  ROLE_ALREADY_EXISTS = 'Role already exists',
  FAILED_TO_CREATE_ROLE = 'Failed to create role',
  FAILED_TO_UPDATE_ROLE = 'Failed to update role',

  UNSUPPORTED_SOCIAL_PROVIDER = 'Unsupported social provider',

  MJML = 'MJML conversion error',
  NO_SMS_PROVIDER = 'No valid SMS provider configured.',

  VALIDATION_ERROR = 'Validation error',
  CONFIG_VALDATION_ERROR = 'Config validation error',
}

export default ResponseMessage;
