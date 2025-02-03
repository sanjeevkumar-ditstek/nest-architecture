// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
// import { InjectModel } from '@nestjs/sequelize';
// import { User } from 'src/db/schemas/user.schema';
// import { Role } from 'src/db/schemas/role.schema';
// import { Permission } from 'src/db/schemas/permissions.schema';
// import { UserRole } from 'src/db/schemas/userRole.schema';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly jwtService: JwtService,
//     @InjectModel(User) private readonly userModel: typeof User,
//     @InjectModel(UserRole) private readonly userRoleModel: typeof UserRole,
//     @InjectModel(Permission)
//     private readonly permissionModel: typeof Permission,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const authHeader = request.headers['authorization'];

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException(
//         'Authorization header is missing or invalid',
//       );
//     }

//     const token = authHeader.split(' ')[1];
//     let decoded;

//     try {
//       decoded = this.jwtService.verify(token, { secret: 'secretKey' });
//     } catch (error) {
//       console.log(error);
//       throw new UnauthorizedException('Invalid or expired token');
//     }

//     const user = await this.userModel.findOne({
//       where: { id: decoded.sub },
//       include: [
//         {
//           model: UserRole,
//           as: 'userRoles',
//           attributes: ['roleId', 'permissionId'],
//           include: [
//             {
//               model: Role,
//               as: 'role',
//               attributes: ['role'],
//             },
//             {
//               model: Permission,
//               as: 'permissions',
//               attributes: ['id', 'module', 'action'],
//             },
//           ],
//         },
//       ],
//     });
//     if (!user) {
//       throw new ForbiddenException('User not found');
//     }

//     if (user.isSuperAdmin) {
//       return true;
//     }

//     const allowedRoles =
//       this.reflector.get<string[]>('roles', context.getHandler()) || [];
//     const allowedPermissions =
//       this.reflector.get<string[]>('permissions', context.getHandler()) || [];
//     const allowedModule = this.reflector.get<string>(
//       'module',
//       context.getHandler(),
//     );

//     const userRoles = user.userRoles || [];
//     const userPermissions = userRoles.flatMap(
//       (permissions) => permissions.permissions || [],
//     );

//     // Role validation
//     const hasRequiredRole = userRoles.some((userRole) =>
//       allowedRoles.includes(userRole.role?.role),
//     );

//     if (!hasRequiredRole) {
//       throw new ForbiddenException(
//         'Access denied: You do not have the required role',
//       );
//     }

//     // Permission validation
//     if (allowedModule && allowedPermissions.length > 0) {
//       const hasRequiredPermission = userPermissions.some(
//         (permission) =>
//           permission.module === allowedModule &&
//           allowedPermissions.includes(permission.action),
//       );

//       if (!hasRequiredPermission) {
//         throw new ForbiddenException(
//           `Insufficient permissions for module '${allowedModule}': You do not have the required permissions`,
//         );
//       }
//     }

//     return true;
//   }
// }

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/db/schemas/user.schema';
import { Role } from 'src/db/schemas/role.schema';
import { Permission } from 'src/db/schemas/permissions.schema';
import { UserRole } from 'src/db/schemas/userRole.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header is missing or invalid',
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = this.jwtService.verify(token, { secret: 'secretKey' });
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.sub },
      relations: ['userRoles', 'userRoles.role', 'userRoles.permission'],
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.isSuperAdmin) {
      return true;
    }

    const allowedRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const allowedPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    const allowedModule = this.reflector.get<string>('module', context.getHandler());

    const userRoles = user.userRoles || [];
    const userPermissions = userRoles.flatMap(
      (userRole) => userRole.permission || [],
    );

    // Role validation
    const hasRequiredRole = userRoles.some((userRole) =>
      allowedRoles.includes(userRole.role.role),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        'Access denied: You do not have the required role',
      );
    }

    // Permission validation
    if (allowedModule && allowedPermissions.length > 0) {
      const hasRequiredPermission = userPermissions.some(
        (permission) =>
          permission.module === allowedModule &&
          allowedPermissions.includes(permission.action),
      );

      if (!hasRequiredPermission) {
        throw new ForbiddenException(
          `Insufficient permissions for module '${allowedModule}': You do not have the required permissions`,
        );
      }
    }

    return true;
  }
}
