export class CreateUserDto {
  email: string;
  password: string;
  userName: string;
}

export class UpdateRoleDto {
  id: string;
}

export class CreatePermissionDto {
  email: string;
  password: string;
  userName: string;
}

export class UpdateRolePermissionDto {
  userId: string;
  roleId: string;
  permissionId: string;
}
