// import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  email: string;
  password: string;
  userName: string;
}

export class UpdateUserDto {
  email: string;
  password: string;
  userName: string;

}

export class CreateRoleDto {
  role: string;
  level: number;
}

export class UpdateRoleDto {
  id: string;
}

export class CreatePermissionDto {
  module: string;
  action: string;
}

export class UpdatePermissionDto {
  id: string;
}

export class assignRolePermissionDto {
  userId: string;
  roleId: string;
  permissionId: string;
}

export class updateRolePermissionDto {
  userId: string;
  roleId: string;
  permissionId: string;
}
export class UpdateRolePermisssionDto {
  id: string;
}
