// import { BadRequestException, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { Op } from 'sequelize';
// import { JwtService } from '@nestjs/jwt';
// import ResponseMessage from 'src/common/enums/ResponseMessages';
// import logger from 'src/common/logger/logger.service';
// import {
//   createRoleRequest,
//   updateRoleResponse,
// } from '../../common/interface/user.interface';
// import { UpdateRoleDto } from './dto/create-role.dto';
// import { FindUserDto } from './dto/find-role.dto';
// import { Role } from 'src/db/schemas/role.schema';
// @Injectable()
// export class RoleService {
//   constructor(
//     @InjectModel(Role) private roleRepository: typeof Role,
//     private jwtService: JwtService,
//   ) {}

//   async createRole(
//     createRoleRequest: createRoleRequest,
//   ): Promise<Role | { message: string }> {
//     try {
//       const { role, level } = createRoleRequest;
//       const existingUser = await this.roleRepository.findOne({
//         where: { role },
//       });
//       // Check if the user already exists
//       if (existingUser) {
//         return { message: ResponseMessage.roleAlreadyExist };
//       }
//       const roles = await this.roleRepository.create({
//         role,
//         level,
//       });
//       console.log(roles, 'roles');
//       logger.info('User successfully craeted');
//       return roles;
//     } catch (error) {
//       logger.error('failed to created usr');
//       logger.error(ResponseMessage.failedToCreateRole, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToCreateRole);
//     }
//   }

//   async updateRole(
//     id: string,
//     updateUserDto: UpdateRoleDto,
//   ): Promise<updateRoleResponse> {
//     try {
//       const role = await this.roleRepository.findByPk(id);
//       //  console.log(user,'user')
//       if (!role) {
//         throw new BadRequestException(ResponseMessage.roleNotFound);
//       }
//       await role.update(updateUserDto);

//       return role;
//     } catch (error) {
//       logger.error(ResponseMessage.failedToUpdateRole, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToUpdateRole);
//     }
//   }

//   async softDeleteUser(id: string): Promise<any> {
//     try {
//       const role = await this.roleRepository.findOne({ where: { id } });

//       if (!role) {
//         throw new BadRequestException(ResponseMessage.roleNotFound);
//       }
//       role.isDeleted = true;
//       await role.save();

//       return {
//         id: role.id,
//       };
//     } catch (error) {
//       logger.error(ResponseMessage.failedToSoftDelete, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToSoftDelete);
//     }
//   }

//   async getUserById(id: string): Promise<Role> {
//     try {
//       const role = await this.roleRepository.findOne({
//         where: { id, isDeleted: false },
//       });
//       if (!role) {
//         throw new BadRequestException(ResponseMessage.userNotFound);
//       }

//       // this.logger.log(`User with ID ${id} retrieved successfully`);
//       return role;
//     } catch (error) {
//       logger.error(ResponseMessage.failedToFetched, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToFetched);
//     }
//   }

//   async getUsers(query: FindUserDto): Promise<any> {
//     try {
//       // Destructure query with default values
//       const {
//         search,
//         sort = 'Desc',
//         filters = {},
//         pageNumber = 1,
//         pageSize = 10,
//       } = query;

//       const limit = Number(pageSize); // Convert page size to a number
//       const offset = (Number(pageNumber) - 1) * limit; // Calculate offset based on page number

//       // Base where condition for non-deleted users
//       const condition: any = { isDeleted: false };

//       // Dynamic search: Allow search across multiple fields
//       if (search) {
//         condition[Op.or] = [
//           { role: { [Op.like]: `%${search}%` } },
//           { level: { [Op.like]: `%${search}%` } },
//         ];
//       }

//       // Handle dynamic filters
//       const parsedFilters = filters || {};
//       Object.entries(parsedFilters).forEach(([key, value]) => {
//         if (value === undefined || value === null || value === '') {
//           // Skip empty or undefined filters to avoid overriding defaults
//           return;
//         }
//         if (typeof value === 'object' && value !== null) {
//           condition[key] = { ...value }; // Operator-based filters (e.g., range, greater than)
//         } else {
//           condition[key] = value; // Exact match filters
//         }
//       });

//       // Sort order
//       const order: any =
//         sort === 'Desc' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
//       console.log(condition, 'condition');
//       // Fetch users from the repository with pagination and filtering
//       const { rows: users, count: totalUsers } =
//         await this.roleRepository.findAndCountAll({
//           where: condition,
//           limit,
//           offset,
//           order,
//         });

//       // Return the response with pagination details
//       return {
//         users,
//         totalUsers,
//         totalPages: Math.ceil(totalUsers / limit),
//         currentPage: Number(pageNumber),
//       };
//     } catch (error) {
//       logger.error(ResponseMessage.failedToFetched, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToFetched);
//     }
//   }
// }
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Import TypeORM repository decorator
import { Repository } from 'typeorm'; // Import TypeORM repository class
import { JwtService } from '@nestjs/jwt';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import {
  createRoleRequest,
  updateRoleResponse,
} from '../../common/interface/user.interface';
import { UpdateRoleDto } from './dto/create-role.dto';
import { FindUserDto } from './dto/find-role.dto';
import { Role } from 'src/db/schemas/role.schema'; // Adjusted to use TypeORM entity

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>, // Inject TypeORM repository
    private jwtService: JwtService,
  ) {}

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
        return { message: ResponseMessage.roleAlreadyExist };
      }

      // Create a new role
      const newRole = this.roleRepository.create({
        role,
        level,
      });

      await this.roleRepository.save(newRole); // Save the new role

      logger.info('Role successfully created');
      return newRole;
    } catch (error) {
      logger.error('Failed to create role');
      logger.error(ResponseMessage.failedToCreateRole, error.stack);
      throw new BadRequestException(ResponseMessage.failedToCreateRole);
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<any> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } }); // Find role by ID
      if (!role) {
        return { message: ResponseMessage.userNotFound };
      }
      await this.roleRepository.save({ ...role, ...updateRoleDto });
      return role;
    } catch (error) {
      logger.error(ResponseMessage.failedToUpdateRole, error.stack);
      throw new BadRequestException(ResponseMessage.failedToUpdateRole);
    }
  }

  async softDeleteRole(id: string): Promise<any> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } }); // Find role by ID
      if (!role) {
        throw new BadRequestException(ResponseMessage.roleNotFound);
      }

      role.isDeleted = true; // Set the isDeleted flag to true
      await this.roleRepository.save(role); // Save the updated role

      return {
        id: role.id,
      };
    } catch (error) {
      logger.error(ResponseMessage.failedToSoftDelete, error.stack);
      throw new BadRequestException(ResponseMessage.failedToSoftDelete);
    }
  }

  async getRoleById(id: string): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id, isDeleted: false }, // Fetch role by ID and ensure it's not deleted
      });
      if (!role) {
        throw new BadRequestException(ResponseMessage.roleNotFound);
      }
      return role;
    } catch (error) {
      logger.error(ResponseMessage.failedToFetched, error.stack);
      throw new BadRequestException(ResponseMessage.failedToFetched);
    }
  }

  async getRoles(query: FindUserDto): Promise<any> {
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

      const [users, totalPermissions] = await this.roleRepository.findAndCount({
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
      logger.error(ResponseMessage.failedToFetchedPermission, error.stack);
      throw new BadRequestException(ResponseMessage.failedToFetched);
    }
  }
}
