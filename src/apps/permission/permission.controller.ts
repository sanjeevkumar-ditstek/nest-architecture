import {
  Controller,
  Post,
  Body,
  UsePipes,
  Delete,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import {
  assignRolePermissionDto,
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../auth/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { YupValidationPipe } from 'src/common/validations/yup-validation.pipe';
import { Query } from '@nestjs/common';
import { QueryParamsDTO } from './dto/query-params.dto';
import { UpdateRolePermissionDto } from './dto/create-permission.dto';
import {
  assignPermissionSchema,
  createPermissionSchema,
} from './schema/permission.schema';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('')
  @ApiOperation({ summary: 'create a new permissionn' })
  @ApiResponse({
    status: 201,
    description: 'permissionn registered successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new YupValidationPipe(createPermissionSchema))
  async register(@Body() createpermissionnDto: CreatePermissionDto) {
    return this.permissionService.create(createpermissionnDto);
  }

  @Get('')
  @ApiOperation({ summary: 'Get users with pagination, search, and filters' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getUsers(
    @Query()
    query: QueryParamsDTO,
  ) {
    return await this.permissionService.read(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getUserById(@Param('id') id: string) {
    return this.permissionService.readOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: ' rol user details' })
  @ApiResponse({ status: 200, description: 'permissionn updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateUser(
    @Param('id') id: string,
    @Body() updatepermissionnDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatepermissionnDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({ status: 200, description: 'User soft deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async softDeleteUser(@Param('id') id: string) {
    return await this.permissionService.delete(id);
  }

  // Assign Role and permission to user

  // @Controller('permission')
  // @Post('assignRolePermission')
  // @ApiOperation({ summary: ' assignRolePermission a new permissionn' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'permissionn registered successfully',
  // })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // @UsePipes(new YupValidationPipe(assignPermissionSchema))
  // async assignRolePermission(@Body() rolePermission: assignRolePermissionDto) {
  //   return this.permissionService.assignRolePermission(rolePermission);
  // }

  // @Put('assignRolePermission/:id')
  // @ApiOperation({ summary: 'Update role and permission for a user' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Role and permission updated successfully',
  // })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // async updateRolePermission(
  //   @Param('id') id: string,
  //   @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  // ) {
  //   return this.permissionService.updateAssignedRolePermission(
  //     id,
  //     updateRolePermissionDto,
  //   );
  // }

  // @Get('/userPermission')
  // @ApiOperation({ summary: 'Get users with pagination, search, and filters' })
  // @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // async getUserWithPermission(
  //   @Query()
  //   query: FindUserDto,
  // ) {
  //   return await this.permissionService.getUserWithPermissions(query);
  // }

  // @Delete('/userPermission/:id')
  // @ApiOperation({ summary: 'Soft delete a user' })
  // @ApiResponse({ status: 200, description: 'User soft deleted successfully' })
  // @ApiResponse({ status: 400, description: 'Bad request' })
  // async userPermission(@Param('id') id: string) {
  //   return await this.permissionService.softDeleteUserPermission(id);
  // }
}
