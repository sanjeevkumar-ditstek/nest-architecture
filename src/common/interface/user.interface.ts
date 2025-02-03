export interface createUserRequest {
  userName: string;
  email: string;
  password: string;
}

export interface loginRequest {
  email: string;
  password: string;
}

export interface loginResponse {
  token: string;
}

export interface updateUserResponse {
  userName: string;
  email: string;
  password: string;
}

export interface createRoleRequest {
  role: string;
  level: number;
}

export interface loginRequest {
  email: string;
  password: string;
}

export interface loginResponse {
  token: string;
}

export interface updateRoleResponse {
  role: string;
  level: number;
  
}

export interface createPermssionRequest {
  module: string;
  action: string;
}

export interface updatePermissionResponse {
  module: string;
  action: string;
}

export interface createRolePermssionRequest {
  userId: string;
  roleId: string;
  permissionId: string;
}

export interface updateRolePermssionRequeste {
  userId: string;
  roleId: string;
  permissionId: string;
}
