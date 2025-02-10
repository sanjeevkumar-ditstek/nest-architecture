import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import { createRoleRequest } from '../../common/interface/user.interface';
import { UpdateRoleDto } from './dto/create-role.dto';
import { FindUserDto } from './dto/find-role.dto';
import { Role } from 'src/db/entity/role.entity';
import { UserRole } from 'src/db/entity/userRole.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
  ) {}

  /**
   * Creates a new role.
   * @param createRoleRequest - The request payload containing the role and its level.
   * @returns The created role or a message if it already exists.
   */
  async createRole(
    createRoleRequest: createRoleRequest,
  ): Promise<Role | { message: string }> {
    try {
      const { role, level } = createRoleRequest;

      // Check if the role already exists
      const existingRole = await this.roleRepository.findOne({
        where: { role },
      });
      if (existingRole) {
        return { message: ResponseMessage.ROLE_ALREADY_EXISTS };
      }

      // Create a new role
      const newRole = this.roleRepository.create({
        role,
        level,
      });

      await this.roleRepository.save(newRole); // Save the new role
      return newRole;
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_CREATE_PERMISSIONS, error.stack);
      throw new BadRequestException(
        ResponseMessage.FAILED_TO_CREATE_PERMISSIONS,
      );
    }
  }

  /**
   * Updates an existing role by ID.
   * @param id - The ID of the role to update.
   * @param updateRoleDto - The updated role data.
   * @returns A message indicating success or failure.
   */

  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } }); // Find role by ID
      if (!role) {
        return { message: ResponseMessage.USER_NOT_FOUND };
      }
      await this.roleRepository.save({ ...role, ...updateRoleDto });
      return { message: ResponseMessage.ROLE_UPDATED };
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_UPDATE_ROLE, error.stack);
      throw new BadRequestException(ResponseMessage.FAILED_TO_UPDATE_ROLE);
    }
  }

  /**
   * Soft deletes a role by ID.
   * @param id - The ID of the role to soft delete.
   * @returns A confirmation message with the role ID.
   */
  async softDeleteRole(id: string): Promise<any> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } }); // Find role by ID
      if (!role) {
        throw new BadRequestException(ResponseMessage.ROLE_NOT_FOUND);
      }

        // Check if the permissionId is linked to any userRole
        const userRole = await this.userRoleRepository.findOne({
          where: {role},
        });
    
        if (userRole) {
          return { message: ResponseMessage.PERMISSION_IN_USE };
        }
      role.isDeleted = true; // Set the isDeleted flag to true
      await this.roleRepository.save(role); // Save the updated role

      return {
        id: role.id,
      };
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_SOFT_DELETE, error.stack);
      throw new BadRequestException(ResponseMessage.FAILED_TO_SOFT_DELETE);
    }
  }

  /**
   * Retrieves a role by its ID.
   * @param id - The ID of the role to retrieve.
   * @returns The role details or throws an error if not found.
   */
  async getById(id: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id, isDeleted: false }, // Fetch role by ID and ensure it's not deleted
      });
      if (!role) {
        throw new BadRequestException(ResponseMessage.ROLE_NOT_FOUND);
      }
      return role;
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_FETCH_ROLES, error.stack);
      throw new BadRequestException(ResponseMessage.FAILED_TO_FETCH_ROLES);
    }
  }

  /**
   * Retrieves roles with pagination, search, and filter options.
   * @param query - The query parameters for filtering, pagination, and sorting.
   * @returns A paginated list of roles.
   */
  async get(query: FindUserDto): Promise<any> {
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

      const [roles, totalPermissions] = await this.roleRepository.findAndCount({
        where: condition,
        take: limit,
        skip: offset,
        // order: { createdAt: order },
      });

      return {
        roles,
        totalPermissions,
        totalPages: Math.ceil(totalPermissions / limit),
        currentPage: Number(pageNumber),
      };
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_FETCH_ROLES, error.stack);
      throw new BadRequestException(ResponseMessage.FAILED_TO_FETCH_ROLES);
    }
  }
}
