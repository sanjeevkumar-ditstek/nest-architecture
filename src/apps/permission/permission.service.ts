import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entity/user.entity';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import {
  createPermssionRequest,
  updatePermissionResponse,
} from '../../common/interface/user.interface';
import { Permission } from 'src/db/entity/permissions.entity';
import { UserRole } from 'src/db/entity/userRole.entity';
import { Role } from 'src/db/entity/role.entity';
import { UpdatePermissionDto } from '../auth/dto/create-user.dto';
import { Repository } from 'typeorm';
import { FindPermissionDto } from './dto/find-permission.dto';
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(UserRole)
    private rolePermissionRepository: Repository<UserRole>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  /**
   * Creates a new permission.
   * @param createpermissionnRequest - The request payload containing module and action.
   * @returns The created permission or a message if it already exists.
   */
  async create(
    createpermissionnRequest: createPermssionRequest,
  ): Promise<Permission | { message: string }> {
    try {
      const { module, action } = createpermissionnRequest;
      const existingPermission = await this.permissionRepository.findOne({
        where: { action, module },
      });
      if (existingPermission) {
        return { message: ResponseMessage.PERMISSION_ALREADY_EXISTS };
      }
      const permission = this.permissionRepository.create({
        action,
        module,
      });
      await this.permissionRepository.save(permission);
      return permission;
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_CREATE_PERMISSIONS, error.stack);
      throw new BadRequestException(
        ResponseMessage.FAILED_TO_CREATE_PERMISSIONS,
      );
    }
  }

  /**
   * Updates an existing permission by ID.
   * @param id - The permission ID.
   * @param updateUserDto - The updated data for the permission.
   * @returns The updated permission or a message if not found.
   */
  async update(
    id: string,
    updateUserDto: UpdatePermissionDto,
  ): Promise<updatePermissionResponse | { message: string }> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
      });
      if (!permission) {
        return { message: ResponseMessage.PERMISSION_NOT_FOUND };
      }
      await this.permissionRepository.save({ ...permission, ...updateUserDto });
      return permission;
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_UPDATE_PERMISSION, error.stack);
      throw new BadRequestException(
        ResponseMessage.FAILED_TO_UPDATE_PERMISSION,
      );
    }
  }
  /**
   * Soft deletes a permission by marking it as deleted.
   * @param id - The permission ID.
   * @returns A success message if deletion is successful.
   */
  async softDelete(id: string): Promise<{ message: string }> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
      });
      if (!permission) {
        return { message: ResponseMessage.PERMISSION_NOT_FOUND };
      }

      // Check if the permissionId is linked to any userRole
      const userRole = await this.rolePermissionRepository.findOne({
        where: { permission },
      });

      if (userRole) {
        return { message: ResponseMessage.PERMISSION_IN_USE };
      }
      permission.isDeleted = true;
      await this.permissionRepository.save(permission);
      return {
        message: ResponseMessage.SOFT_DELETED,
      };
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_SOFT_DELETE, error.stack);
      throw new BadRequestException(ResponseMessage.FAILED_TO_SOFT_DELETE);
    }
  }

  /**
   * Retrieves a permission by ID.
   * @param id - The permission ID.
   * @returns The permission if found, otherwise throws an error.
   */
  async getById(id: string): Promise<Permission> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!permission) {
        throw new BadRequestException(ResponseMessage.PERMISSION_NOT_FOUND);
      }
      return permission;
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_FETCH_PERMISSIONS, error.stack);
      throw new BadRequestException(
        ResponseMessage.FAILED_TO_FETCH_PERMISSIONS,
      );
    }
  }

  /**
   * Retrieves a paginated list of permissions with optional filters and sorting.
   * @param query - The query parameters for filtering, sorting, and pagination.
   * @returns A paginated list of permissions.
   */
  async get(query: FindPermissionDto): Promise<any> {
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

      const [permissions, totalPermissions] =
        await this.permissionRepository.findAndCount({
          where: condition,
          take: limit,
          skip: offset,
          // order: { createdAt: order },
        });
      return {
        permissions,
        totalPermissions,
        totalPages: Math.ceil(totalPermissions / limit),
        currentPage: Number(pageNumber),
      };
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_FETCH_PERMISSIONS, error.stack);
      throw new BadRequestException(
        ResponseMessage.FAILED_TO_FETCH_PERMISSIONS,
      );
    }
  }
}
