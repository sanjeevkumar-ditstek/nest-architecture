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
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from '../auth/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { createRoleSchema, updateRoleSchema } from './schema/role.schema';
import { YupValidationPipe } from 'src/common/validations/yup-validation.pipe';
import { Query } from '@nestjs/common';
import { FindUserDto } from './dto/find-role.dto';
import StatusCodeEnum from 'src/common/enums/StatusCodeEnum';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import Roles from 'src/common/enums/role';
import Modules from 'src/common/enums/modules';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Creates a new role.
   * @param createRoleDto - The request payload containing role details.
   * @returns The created role.
   */
  @Post()
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: 'create a new role' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.ROLE_CREATED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  @UsePipes(new YupValidationPipe(createRoleSchema))
  async register(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  /**
   * Updates an existing role.
   * @param id - The ID of the role to be updated.
   * @param updateRoleDto - The request payload containing updated role details.
   * @returns The updated role.
   */

  @Put(':id')
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: ' role user details' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.ROLE_CREATED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  @UsePipes(new YupValidationPipe(updateRoleSchema))
  async updateUser(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  /**
   * Soft deletes a role by ID.
   * @param id - The ID of the role to be deleted.
   * @returns A confirmation message of the soft deletion.
   */
  @Delete(':id')
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.ROLE_UPDATED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  async softDeleteUser(@Param('id') id: string) {
    return await this.roleService.softDeleteRole(id);
  }

  /**
   * Retrieves a list of roles with pagination, search, and filters.
   * @param query - The query parameters for filtering and pagination.
   * @returns A paginated list of roles.
   */
  @Get()
  @SetMetadata('roles', [Roles.SUPER_ADMIN])
  @ApiOperation({ summary: 'Get users with pagination, search, and filters' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.GET_ROLE,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  async getUsers(
    @Query()
    query: FindUserDto,
  ) {
    return await this.roleService.get(query);
  }

  /**
   * Retrieves a role by its ID.
   * @param id - The ID of the role to be fetched.
   * @returns The role details.
   */
  @Get(':id')
  @SetMetadata('roles', [Roles.ADMIN, Roles.SUPER_ADMIN])
  @SetMetadata('module', [Modules.PERMISSION])
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.GET_ROLE,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  async getUserById(@Param('id') id: string) {
    return this.roleService.getById(id);
  }
}
