import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../db/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import RoleLevel from '../enums/RoleLevels';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    const decoded = this.jwtService.verify(token, { secret: 'secretKey' });

    // Fetch user data from the database
    const [user] = await this.userModel.aggregate([
      { $match: { _id: new ObjectId(decoded.sub) } },
      {
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'roles',
        },
      },
      {
        $lookup: {
          from: 'permissions',
          localField: 'permissions',
          foreignField: '_id',
          as: 'permissions',
        },
      },
    ]);
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    // Check for SuperAdmin role
    if (user.isUserSuperAdmin) {
      return true;
    }
    if (!user.roles.length) {
      throw new ForbiddenException(
        'Access denied: You do not have the required role',
      );
    }
    // Mapping to add the level based on the role
    user.roles.forEach((roleDetail) => {
      let level;
      switch (roleDetail.role) {
        case 'admin':
          level = RoleLevel.ADMIN;
          break;
        case 'user':
          level = RoleLevel.USER;
          break;
        default:
          level = null; // or handle unexpected roles
      }
      roleDetail.level = level;
    });

    // Sort roles by level in ascending order
    user.roles.sort((a, b) => (a.level ?? Infinity) - (b.level ?? Infinity));

    const allowedRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const allowedPermissions =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    const allowedModule = this.reflector.get<string>(
      'module',
      context.getHandler(),
    );

    const matchedRoles = user.roles.filter((roleDetail) =>
      allowedRoles.includes(roleDetail.role),
    );
    // console.log('matchedRoles:', matchedRoles);

    if (!matchedRoles.length) {
      throw new ForbiddenException(
        'Access denied: You do not have the required role',
      );
    }

    if (allowedModule && allowedPermissions) {
      // const userPermissions = matchedRoles.flatMap(
      //   (roleDetail) => roleDetail.permissions,
      // );
      // Check if user has the required permission for the allowed module
      const hasRequiredPermission = user.permissions.some(
        (userPerm) =>
          userPerm.module === allowedModule &&
          allowedPermissions.includes(userPerm.action),
      );
      if (!hasRequiredPermission) {
        throw new ForbiddenException(
          `Insufficient permissions for module '${allowedModule}': You do not have the required permissions`,
        );
      }
    }

    return true; // Access granted
  }
}
