import {
  Controller,
  Post,
  Body,
  UsePipes,
  Delete,
  Param,
  Put,
  Get,
  SetMetadata,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../auth/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { YupValidationPipe } from 'src/common/validations/yup-validation.pipe';
import { Query } from '@nestjs/common';
import { FindPermissionDto } from './dto/find-permission.dto';
import {
  createPermissionSchema,
  updatePermissionSchema,
} from './schema/permission.schema';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import StatusCodeEnum from 'src/common/enums/StatusCodeEnum';
import Roles from 'src/common/enums/role';
import Modules from 'src/common/enums/modules';
import Permissions from 'src/common/enums/permission';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * @description Creates a new permission entry.
   * @param createpermissionnDto - DTO containing permission data.
   * @returns Created permission data.
   */
  @Post()
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: 'create a new permission' })
  @ApiResponse({
    status: StatusCodeEnum.CREATED,
    description: ResponseMessage.PERMISSION_CREATED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  @UsePipes(new YupValidationPipe(createPermissionSchema))
  async create(@Body() createpermissionnDto: CreatePermissionDto) {
    return this.permissionService.create(createpermissionnDto);
  }

  /**
   * @description Updates an existing permission entry by ID.
   * @param  id - ID of the permission to update.
   * @param updatepermissionnDto - DTO containing updated permission data.
   * @returns Updated permission data.
   */
  @Put(':id')
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: ' update permission details' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.PERMISSION_UPDATED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  @UsePipes(new YupValidationPipe(updatePermissionSchema))
  async updateUser(
    @Param('id') id: string,
    @Body() updatepermissionnDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatepermissionnDto);
  }

  /**
   * @description Soft deletes a permission entry by ID.
   * @param id - ID of the permission to be deleted.
   * @returns Confirmation of soft deletion.
   */
  @Delete(':id')
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.PERMISSION_SOFT_DELETED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  async softDeleteUser(@Param('id') id: string) {
    return await this.permissionService.softDelete(id);
  }

  /**
   * @description Retrieves a list of permissions with optional pagination, search, and filters.
   * @param query - Query parameters for filtering.
   * @returns List of permissions.
   */
  @Get()
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Get users with pagination, search, and filters' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.GET_PERMISSIONS,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  async getUsers(
    @Query()
    query: FindPermissionDto,
  ) {
    return await this.permissionService.get(query);
  }

  /**
   * @description Retrieves a permission by ID.
   * @param  id - ID of the permission.
   * @returns Permission data if found.
   */
  @Get(':id')
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.GET_PERMISSION,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  async getUserById(@Param('id') id: string) {
    return this.permissionService.getById(id);
  }
}
