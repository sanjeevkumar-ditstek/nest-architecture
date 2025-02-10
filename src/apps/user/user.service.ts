import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../db/entity/user.entity';
import {
  createUserRequest,
  updateUserRequest,
} from 'src/common/interface/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import { Role } from 'src/db/entity/role.entity';
import { Permission } from 'src/db/entity/permissions.entity';
import { UserRole } from 'src/db/entity/userRole.entity';
import { FindUserDto } from '../auth/dto/find-User.dto';
import { In } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(UserRole)
    private userPermissionRepository: Repository<UserRole>,
  ) {}

  async create(
    createUserRequest: createUserRequest,
  ): Promise<User | UserRole | { message: string }> {
    try {
      const { userName, email, password, roleId, permissionIds } =
        createUserRequest;

      // Check if the user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        return { message: ResponseMessage.USER_ALREADY_EXISTS };
      }
      // Check if the role exists
      const existingRole = await this.roleRepository.findOne({
        where: { id: roleId, isDeleted: false },
      });
      if (!existingRole) {
        return { message: ResponseMessage.ROLE_NOT_FOUND };
      }

      // Fetch all permissions that match the given IDs
      const existingPermission = await this.permissionRepository.findBy({
        id: In(permissionIds),
        isDeleted: false,
      });
      console.log(existingPermission, 'existingpermission');
      if (!existingPermission) {
        return { message: ResponseMessage.ROLE_NOT_FOUND };
      }
      if (existingPermission.length !== permissionIds.length) {
        return { message: ResponseMessage.PERMISSION_NOT_FOUND };
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the user
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        userName,
      });
      await this.userRepository.save(user);
      // Assign role & multiple permissions using UserRole entity
      const userRoles = existingPermission.map((permission) => {
        return this.userPermissionRepository.create({
          user,
          role: existingRole,
          permission,
        });
      });
      console.log(userRoles, 'userROL');
      await this.userPermissionRepository.save(userRoles);
      return user;
    } catch (error) {
      throw new BadRequestException(ResponseMessage.INVALID_CREDENTIALS);
    }
  }

  async update(
    userId: string,
    updateUserRequest: updateUserRequest,
  ): Promise<User | { message: string }> {
    try {
      const { userName, email, password, roleId, permissionIds } =
        updateUserRequest;

      // Check if the user exists
      const user = await this.userRepository.findOne({
        where: { id: userId, isDeleted: false },
        // relations: ['userRoles', 'userRoles.role', 'userRoles.permission'],
      });

      if (!user) {
        return { message: ResponseMessage.USER_NOT_FOUND };
      }

      // Check if the role exists
      const existingRole = await this.roleRepository.findOne({
        where: { id: roleId, isDeleted: false },
      });

      if (!existingRole) {
        return { message: ResponseMessage.ROLE_NOT_FOUND };
      }

      // Hash the new password if provided
      let hashedPassword = user.password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // Update user details
      user.userName = userName || user.userName;
      user.email = email || user.email;
      user.password = hashedPassword;

      await this.userRepository.save(user);

      // Update permissions if actions are provided
      // if (Array.isArray(action) && action.length > 0) {
      //   // Remove existing userRole entries for the user
      //   await this.userPermissionRepository.delete({ user });

      // for (const act of action) {
      //   const existingPermission = await this.permissionRepository.findOne({
      //     where: { module, action: act },
      //   });

      // if (!existingPermission) {
      //   return { message: ResponseMessage.PERMISSION_NOT_FOUND };
      // }

      // const userRole = this.userPermissionRepository.create({
      //   user,
      //   role: existingRole,
      //   permission: existingPermission,
      // });

      // await this.userPermissionRepository.save(userRole);
      // }
      // }
      return user;
    } catch (error) {
      throw new BadRequestException(ResponseMessage.FAILED_TO_UPDATE_USER);
    }
  }

  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['userRoles'],
      });

      if (!user) {
        return { message: ResponseMessage.USER_NOT_FOUND };
      }

      if (user.userRoles.length > 0) {
        await this.userPermissionRepository.update(
          { user: { id } },
          { isDeleted: true },
        );
      }
      await this.userRepository.update({ id }, { isDeleted: true });

      return { message: ResponseMessage.SOFT_DELETED };
    } catch (error) {
      throw new BadRequestException(ResponseMessage.FAILED_TO_SOFT_DELETE);
    }
  }

  async getUsers(query: FindUserDto): Promise<any> {
    try {
      const {
        search,
        sort = 'Desc',
        filters = {},
        pageNumber = 1,
        pageSize = 10,
      } = query;

      const limit = Number(pageSize);
      const offset = (Number(pageNumber) - 1) * limit;

      const condition: any = { isDeleted: false };

      if (search) {
        condition.action = { $like: `%${search}%` };
      }

      const parsedFilters = filters || {};
      Object.entries(parsedFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return;
        }
        condition[key] = value;
      });

      const order = sort === 'Desc' ? 'DESC' : 'ASC';

      const [users, totalPermissions] = await this.userRepository.findAndCount({
        where: condition,
        take: limit,
        skip: offset,
        // order: { createdAt: order },
      });
      return {
        users,
        totalPermissions,
        totalPages: Math.ceil(totalPermissions / limit),
        currentPage: Number(pageNumber),
      };
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_FETCH_USERS, error.stack);
      throw new BadRequestException(ResponseMessage.FAILED_TO_FETCH_USERS);
    }
  }
}
