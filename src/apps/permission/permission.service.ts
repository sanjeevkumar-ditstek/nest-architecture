import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import {
  createPermssionRequest,
  updatePermissionResponse,
} from '../../common/interface/user.interface';
import { QueryParamsDTO } from './dto/query-params.dto';
import { Permission } from 'src/db/schemas/permissions.schema';
import { UpdatePermissionDto } from '../auth/dto/create-user.dto';
@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission) private PermissionRepository: typeof Permission,
  ) {}

  async create(
    createpermissionnRequest: createPermssionRequest,
  ): Promise<Permission | { message: string }> {
    try {
      const { module, action } = createpermissionnRequest;
      const permissionAlreadyExist = await this.PermissionRepository.findOne({
        where: { action, module },
      });
      if (permissionAlreadyExist) {
        return { message: ResponseMessage.PERMISSION_ALREADY_EXIST };
      }
      const permissionns = await this.PermissionRepository.create({
        action,
        module,
      });
      return permissionns;
    } catch (error) {
      logger.error(ResponseMessage.failedToCreatePermissions, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToCreatePermissions);
    }
  }

  async read(query: QueryParamsDTO): Promise<any> {
    try {
      // Destructure query with default values
      const {
        search,
        sort = 'Desc',
        filters = {},
        pageNumber = 1,
        pageSize = 10,
      } = query;

      const limit = Number(pageSize); // Convert page size to a number
      const offset = (Number(pageNumber) - 1) * limit; // Calculate offset based on page number

      // Base where condition for non-deleted users
      const condition: any = { isDeleted: false };

      // Dynamic search: Allow search across multiple fields
      if (search) {
        condition[Op.or] = [
          { permissionn: { [Op.like]: `%${search}%` } },
          { level: { [Op.like]: `%${search}%` } },
        ];
      }

      // Handle dynamic filters
      const parsedFilters = filters || {};
      Object.entries(parsedFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          // Skip empty or undefined filters to avoid overriding defaults
          return;
        }
        if (typeof value === 'object' && value !== null) {
          condition[key] = { ...value }; // Operator-based filters (e.g., range, greater than)
        } else {
          condition[key] = value; // Exact match filters
        }
      });

      // Sort order
      const order: any =
        sort === 'Desc' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
      console.log(condition, 'condition');
      // Fetch users from the repository with pagination and filtering
      const { rows: users, count: totalUsers } =
        await this.PermissionRepository.findAndCountAll({
          where: condition,
          limit,
          offset,
          order,
        });

      // Return the response with pagination details
      return {
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: Number(pageNumber),
      };
    } catch (error) {
      logger.error(ResponseMessage.failedToFetchedPermission, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToFetchedPermission);
    }
  }

  async readOne(id: string): Promise<Permission> {
    try {
      const permissionn = await this.PermissionRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!permissionn) {
        throw new BadRequestException(ResponseMessage.PERMISSION_NOT_FOUND);
      }

      return permissionn;
    } catch (error) {
      logger.error(ResponseMessage.failedToFetchedPermission, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToFetchedPermission);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdatePermissionDto,
  ): Promise<updatePermissionResponse> {
    try {
      const permissionn = await this.PermissionRepository.findByPk(id);
      if (!permissionn) {
        throw new BadRequestException(ResponseMessage.permissionNotFound);
      }
      await permissionn.update(updateUserDto);

      return permissionn;
    } catch (error) {
      logger.error(ResponseMessage.failedToUpdatePermission, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToUpdatePermission);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const permissionn = await this.PermissionRepository.findOne({
        where: { id },
      });

      if (!permissionn) {
        throw new BadRequestException(ResponseMessage.PERMISSION_NOT_FOUND);
      }
      permissionn.isDeleted = true;
      await permissionn.save();

      return {
        id: permissionn.id,
      };
    } catch (error) {
      logger.error(ResponseMessage.failedToSoftDelete, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToSoftDelete);
    }
  }
}
