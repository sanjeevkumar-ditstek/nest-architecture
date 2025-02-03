
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import {
  createPermssionRequest,
  createRolePermssionRequest,
  updatePermissionResponse,
} from '../../common/interface/user.interface';
import { FindUserDto } from './dto/find-permission.dto';
import { Permission } from 'src/db/schemas/permissions.schema';
import { UserRole } from 'src/db/schemas/userRole.schema'
import { Role } from 'src/db/schemas/role.schema'
import {
  UpdatePermissionDto,
  updateRolePermissionDto,
} from '../auth/dto/create-user.dto';
import { Repository } from 'typeorm';

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

    private jwtService: JwtService,
  ) {}

//   async createPermission(
//     createpermissionnRequest: createPermssionRequest,
//   ): Promise<Permission | { message: string }> {
//     try {
//       const { module, action } = createpermissionnRequest;
//       const existingUser = await this.permissionRepository.findOne({
//         where: { action },
//       });
//       console.log(existingUser, 'bhjklhjkl');
//       // Check if the user already exists
//       if (existingUser) {
//         // logger.error(ResponseMessage.userAlreadyExist)
//         return { message: ResponseMessage.permissionAlreadyExist };
//       }
//       // const hashedPassword = await bcrypt.hash(password, 10);
//       const permissionns = await this.permissionRepository.create({
//         action,
//         module,
//       });
//       console.log(permissionns, 'permissionns');
//       logger.info('User successfully craeted');
//       return permissionns;
//     } catch (error) {
//       logger.error('failed to created usr');
//       logger.error(ResponseMessage.failedToCreatePermissions, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToCreatePermissions);
//     }
//   }

//   async updatepermissionn(
//     id: string,
//     updateUserDto: UpdatePermissionDto,
//   ): Promise<updatePermissionResponse> {
//     try {
//       const permissionn = await this.permissionRepository.findByPk(id);
//       if (!permissionn) {
//         throw new BadRequestException(ResponseMessage.permissionNotFound);
//       }
//       await permissionn.update(updateUserDto);

//       return permissionn;
//     } catch (error) {
//       logger.error(ResponseMessage.failedToUpdatePermission, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToUpdatePermission);
//     }
//   }

//   async softDeletePermission(id: string): Promise<any> {
//     try {
//       const permissionn = await this.permissionRepository.findOne({
//         where: { id },
//       });

//       if (!permissionn) {
//         throw new BadRequestException(ResponseMessage.permissionNotFound);
//       }
//       permissionn.isDeleted = true;
//       await permissionn.save();

//       return {
//         id: permissionn.id,
//       };
//     } catch (error) {
//       logger.error(ResponseMessage.failedToSoftDelete, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToSoftDelete);
//     }
//   }

//   async getPermissionById(id: string): Promise<Permission> {
//     try {
//       const permissionn = await this.PermissionRepository.findOne({
//         where: { id, isDeleted: false },
//       });
//       if (!permissionn) {
//         throw new BadRequestException(ResponseMessage.permissionNotFound);
//       }

//       // this.logger.log(`User with ID ${id} retrieved successfully`);
//       return permissionn;
//     } catch (error) {
//       logger.error(ResponseMessage.failedToFetchedPermission, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToFetchedPermission);
//     }
//   }

//   async getPermissions(query: FindUserDto): Promise<any> {
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
//           { permissionn: { [Op.like]: `%${search}%` } },
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
//         await this.PermissionRepository.findAndCountAll({
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
//       logger.error(ResponseMessage.failedToFetchedPermission, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToFetchedPermission);
//     }
//   }

//   // assign role and permission to user.

//   async assignRolePermission(
//     createpermissionRequest: createRolePermssionRequest,
//   ): Promise<UserRole | { message: string }> {
//     try {
//       const { userId, roleId, permissionId } = createpermissionRequest;

//       // Check if the user exists
//       const existingUser = await this.UserRepository.findByPk(userId);
//       if (!existingUser) {
//         return { message: ResponseMessage.userNotFound }; // If user doesn't exist, return a message
//       }

//       // Check if the role exists
//       const existingRole = await this.RoleRepository.findByPk(roleId);
//       if (!existingRole) {
//         return { message: ResponseMessage.roleNotFound }; // If role doesn't exist, return a message
//       }

//       // Check if the permission exists
//       const existingPermission =
//         await this.PermissionRepository.findByPk(permissionId);
//       if (!existingPermission) {
//         return { message: ResponseMessage.permissionNotFound };
//       }

//       // If all checks pass, assign the role and permission to the user in the userRole table
//       const userRole = this.RolePermissionRepository.create({
//         userId,
//         roleId,
//         permissionId,
//       });

//       // const userRoles =await this.RolePermissionRepository.save(userRole);

//       logger.info('Role and permission successfully assigned to user');
//       return userRole;
//     } catch (error) {
//       logger.error(ResponseMessage.failedToFetched, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToFetched);
//     }
//   }

//   async updateAssignedRolePermission(
//     id: string,
//     updateRolePermissionRequest: updateRolePermissionDto,
//   ): Promise<UserRole | { message: string }> {
//     try {
//       const { userId, roleId, permissionId } = updateRolePermissionRequest;

//       // Find the existing userRole entry
//       const userRole = await this.RolePermissionRepository.findByPk(id);
//       if (!userRole) {
//         throw new BadRequestException(ResponseMessage.userRoleNotFound);
//       }

//       // Validate that the user exists
//       const userExists = await this.UserRepository.findByPk(userId);
//       if (!userExists) {
//         throw new BadRequestException(ResponseMessage.userNotFound);
//       }

//       // Validate that the role exists
//       const roleExists = await this.RoleRepository.findByPk(roleId);
//       if (!roleExists) {
//         throw new BadRequestException(ResponseMessage.roleNotFound);
//       }

//       // Validate that the permission exists
//       const permissionExists =
//         await this.PermissionRepository.findByPk(permissionId);
//       if (!permissionExists) {
//         throw new BadRequestException(ResponseMessage.permissionNotFound);
//       }

//       // Update the userRole entry with new data
//       await userRole.update({
//         userId,
//         roleId,
//         permissionId,
//       });

//       logger.info('User role and permission updated successfully');
//       return userRole;
//     } catch (error) {
//       logger.error(ResponseMessage.failedToUpdateUserRole, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToUpdateUserRole);
//     }
//   }

//   async getUserWithPermissions(query: FindUserDto): Promise<any> {
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
//           { permissionId: { [Op.like]: `%${search}%` } },
//           { userId: { [Op.like]: `%${search}%` } },
//           { userId: { [Op.like]: `%${search}%` } },
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
//         await this.RolePermissionRepository.findAndCountAll({
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

//   async softDeleteUserPermission(id: string): Promise<any> {
//     try {
//       const userPermission = await this.RolePermissionRepository.findOne({
//         where: { id },
//       });

//       if (!userPermission) {
//         throw new BadRequestException(ResponseMessage.userNotFound);
//       }
//       userPermission.isDeleted = true;
//       await userPermission.save();

//       return {
//         id: userPermission.id,
//       };
//     } catch (error) {
//       logger.error(ResponseMessage.failedToSoftDelete, error.stack); // Log error with stack trace
//       throw new BadRequestException(ResponseMessage.failedToSoftDelete);
//     }
//   }
// }




async createPermission(
  createpermissionnRequest: createPermssionRequest,
): Promise<Permission | { message: string }> {
  try {
    const { module, action } = createpermissionnRequest;
    const existingUser = await this.permissionRepository.findOne({
      where: { action },
    });

    if (existingUser) {
      return { message: ResponseMessage.permissionAlreadyExist };
    }

    const permission = this.permissionRepository.create({
      action,
      module,
    });
    await this.permissionRepository.save(permission);
    logger.info('Permission successfully created');
    return permission;
  } catch (error) {
    logger.error('Failed to create permission');
    logger.error(ResponseMessage.failedToCreatePermissions, error.stack);
    throw new BadRequestException(ResponseMessage.failedToCreatePermissions);
  }
}

async updatepermissionn(
  id: string,
  updateUserDto: UpdatePermissionDto,
): Promise<updatePermissionResponse> {
  try {
    const permission = await this.permissionRepository.findOne({where:{id}});
    if (!permission) {
      throw new BadRequestException(ResponseMessage.permissionNotFound);
    }
    await this.permissionRepository.save({ ...permission, ...updateUserDto });
    return permission;
  } catch (error) {
    logger.error(ResponseMessage.failedToUpdatePermission, error.stack);
    throw new BadRequestException(ResponseMessage.failedToUpdatePermission);
  }
}

async softDeletePermission(id: string): Promise<any> {
  try {
    const permission = await this.permissionRepository.findOne({where:{id}});
    if (!permission) {
      throw new BadRequestException(ResponseMessage.permissionNotFound);
    }
    permission.isDeleted = true;
    await this.permissionRepository.save(permission);
    return {
      id: permission.id,
    };
  } catch (error) {
    logger.error(ResponseMessage.failedToSoftDelete, error.stack);
    throw new BadRequestException(ResponseMessage.failedToSoftDelete);
  }
}

async getPermissionById(id: string): Promise<Permission> {
  try {
    const permission = await this.permissionRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!permission) {
      throw new BadRequestException(ResponseMessage.permissionNotFound);
    }
    return permission;
  } catch (error) {
    logger.error(ResponseMessage.failedToFetchedPermission, error.stack);
    throw new BadRequestException(ResponseMessage.failedToFetchedPermission);
  }
}

async getPermissions(query: FindUserDto): Promise<any> {
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

    const [permissions, totalPermissions] = await this.permissionRepository.findAndCount({
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
    logger.error(ResponseMessage.failedToFetchedPermission, error.stack);
    throw new BadRequestException(ResponseMessage.failedToFetchedPermission);
  }
}

async assignRolePermission(
  createpermissionRequest: createRolePermssionRequest,
): Promise<UserRole | { message: string }> {
  try {
    const { userId, roleId, permissionId } = createpermissionRequest;

    const existingUser = await this.userRepository.findOne({where:{id:userId}});
    if (!existingUser) {
      return { message: ResponseMessage.userNotFound };
    }

    const existingRole = await this.roleRepository.findOne({where:{id:roleId}});
    if (!existingRole) {
      return { message: ResponseMessage.roleNotFound };
    }

    const existingPermission = await this.permissionRepository.findOne({where:{id:permissionId}});
    if (!existingPermission) {
      return { message: ResponseMessage.permissionNotFound };
    }

    const userRole = this.rolePermissionRepository.create({
      // userId,
      // roleId,
      // permissionId,
    });

    await this.rolePermissionRepository.save(userRole);
    logger.info('Role and permission successfully assigned to user');
    return userRole;
  } catch (error) {
    logger.error(ResponseMessage.failedToFetched, error.stack);
    throw new BadRequestException(ResponseMessage.failedToFetched);
  }
}

async updateAssignedRolePermission(
  id: string,
  updateRolePermissionRequest: updateRolePermissionDto,
): Promise<UserRole | { message: string }> {
  try {
    const { userId, roleId, permissionId } = updateRolePermissionRequest;

    const userRole = await this.rolePermissionRepository.findOne({where:{id}});
    if (!userRole) {
      throw new BadRequestException(ResponseMessage.userRoleNotFound);
    }

    const userExists = await this.userRepository.findOne({where:{id}});
    if (!userExists) {
      throw new BadRequestException(ResponseMessage.userNotFound);
    }

    const roleExists = await this.roleRepository.findOne({where:{id}});
    if (!roleExists) {
      throw new BadRequestException(ResponseMessage.roleNotFound);
    }

    const permissionExists = await this.permissionRepository.findOne({where:{id:permissionId}});
    if (!permissionExists) {
      throw new BadRequestException(ResponseMessage.permissionNotFound);
    }

    // userRole.userId = userId;
    // userRole.roleId = roleId;
    // userRole.permissionId = permissionId;
    await this.rolePermissionRepository.save(userRole);

    logger.info('User role and permission updated successfully');
    return userRole;
  } catch (error) {
    logger.error(ResponseMessage.failedToUpdateUserRole, error.stack);
    throw new BadRequestException(ResponseMessage.failedToUpdateUserRole);
  }
}

async getUserWithPermissions(query: FindUserDto): Promise<any> {
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
      condition.userId = { $like: `%${search}%` };
      condition.permissionId = { $like: `%${search}%` };
    }

    const parsedFilters = filters || {};
    Object.entries(parsedFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }
      condition[key] = value;
    });

    const order = sort === 'Desc' ? 'DESC' : 'ASC';

    const [userPermissions, totalPermissions] = await this.rolePermissionRepository.findAndCount({
      where: condition,
      take: limit,
      skip: offset,
      // order: { createdAt: order },
    });

    return {
      userPermissions,
      totalPermissions,
      totalPages: Math.ceil(totalPermissions / limit),
      currentPage: Number(pageNumber),
    };
  } catch (error) {
    logger.error(ResponseMessage.failedToFetched, error.stack);
    throw new BadRequestException(ResponseMessage.failedToFetched);
  }
}

async softDeleteUserPermission(id: string): Promise<any> {
  try {
    const userPermission = await this.rolePermissionRepository.findOne({where:{id}});
    if (!userPermission) {
      throw new BadRequestException(ResponseMessage.userNotFound);
    }
    userPermission.isDeleted = true;
    await this.rolePermissionRepository.save(userPermission);
    return {
      id: userPermission.id,
    };
  } catch (error) {
    logger.error(ResponseMessage.failedToSoftDelete, error.stack);
    throw new BadRequestException(ResponseMessage.failedToSoftDelete);
  }
}
}