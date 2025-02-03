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
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from '../auth/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  createRoleSchema,
  deleteRoleSchema,
  updateRoleSchema,
} from './schema/role.schema';
import { YupValidationPipe } from 'src/common/validations/yup-validation.pipe';
import { Query } from '@nestjs/common';
import { FindUserDto } from './dto/find-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('createRole')
  @ApiOperation({ summary: 'create a new role' })
  @ApiResponse({ status: 201, description: 'role registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new YupValidationPipe(createRoleSchema))
  async register(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: ' rol user details' })
  @ApiResponse({ status: 200, description: 'role updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new YupValidationPipe(updateRoleSchema))
  async updateUser(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({ status: 200, description: 'User soft deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  // @UsePipes(new YupValidationPipe(deleteRoleSchema))
  async softDeleteUser(@Param('id') id: string) {
    return await this.roleService.softDeleteRole(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get users with pagination, search, and filters' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getUsers(
    @Query()
    query: FindUserDto,
  ) {
    return await this.roleService.getRoles(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getUserById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }
}
