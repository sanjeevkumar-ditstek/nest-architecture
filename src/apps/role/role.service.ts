import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { JwtService } from '@nestjs/jwt';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import {
  createRoleRequest,
  updateRoleResponse,
} from '../../common/interface/user.interface';
import { UpdateRoleDto } from './dto/create-role.dto';
import { QueryParamsDTO } from './dto/query-params.dto';
import { Role } from 'src/db/schemas/role.schema';
@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    private jwtService: JwtService,
  ) {}

  async create(
    createRoleRequest: createRoleRequest,
  ): Promise<Role | { message: string }> {
    try {
      const { role, level } = createRoleRequest;
      const roleAlreadyExist = await this.roleRepository.findOne({
        where: { role, level },
      });
      // Check if the user already exists
      if (roleAlreadyExist) {
        return { message: ResponseMessage.ROLE_ALREADY_EXIST };
      }
      const roles = await this.roleRepository.create({
        role,
        level,
      });
      return roles;
    } catch (error) {
      logger.error(ResponseMessage.failedToCreateRole, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToCreateRole);
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
          { role: { [Op.like]: `%${search}%` } },
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
      // Fetch users from the repository with pagination and filtering
      const { rows: users, count: totalCount } =
        await this.roleRepository.findAndCountAll({
          where: condition,
          limit,
          offset,
          order,
        });

      // Return the response with pagination details
      return {
        users,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(pageNumber),
      };
    } catch (error) {
      logger.error(ResponseMessage.failedToFetched, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToFetched);
    }
  }

  async readOne(id: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!role) {
        throw new BadRequestException(ResponseMessage.ROLE_NOT_FOUND);
      }

      // this.logger.log(`User with ID ${id} retrieved successfully`);
      return role;
    } catch (error) {
      logger.error(ResponseMessage.failedToFetched, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToFetched);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateRoleDto,
  ): Promise<updateRoleResponse> {
    try {
      const role = await this.roleRepository.findByPk(id);
      //  console.log(user,'user')
      if (!role) {
        throw new BadRequestException(ResponseMessage.roleNotFound);
      }
      await role.update(updateUserDto);

      return role;
    } catch (error) {
      logger.error(ResponseMessage.failedToUpdateRole, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToUpdateRole);
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        throw new BadRequestException(ResponseMessage.roleNotFound);
      }
      role.isDeleted = true;
      await role.save();

      return {
        id: role.id,
      };
    } catch (error) {
      logger.error(ResponseMessage.failedToSoftDelete, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToSoftDelete);
    }
  }
}
