import {
  Controller,
  UseGuards,
  SetMetadata,
  Post,
  Body,
  Version,
  UsePipes,
  Put,
  Param,
  Delete,
  Get,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import Roles from 'src/common/enums/role';
import Permissions from 'src/common/enums/permission';
import Modules from 'src/common/enums/modules';
import { EmailService } from 'src/common/utils/email/email.service';
import { SmsService } from 'src/common/utils/sms/sms.service';
import { SendEmailDto } from '../auth/dto/send-email.dto';
import { RolesGuard } from 'src/common/gaurds/role-gaurd';
import { YupValidationPipe } from 'src/common/validations/yup-validation.pipe';
import { CreateUserDto, UpdateUserDto } from '../auth/dto/create-user.dto';
import { createSchema } from '../auth/schema/register.schema';
import { UserService } from './user.service';
import { FindUserDto } from '../auth/dto/find-User.dto';
import { updateSchema } from './schema/user.schema';
import StatusCodeEnum from 'src/common/enums/StatusCodeEnum';
import ResponseMessage from 'src/common/enums/ResponseMessages';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('user')
// @UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly userService: UserService,
  ) {}

  /**
   * Register a new user.
   * This endpoint allows the creation of a new user. It expects a valid `createUserDto`
   * and validates it using the Yup validation schema `createSchema`.
   * Roles and permissions are checked based on metadata:
   * Roles: [ADMIN], Permissions: [READ, CREATE].
   */
  @Version('1')
  @Post()
  @SetMetadata('roles', [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.USER])
  @SetMetadata('module', [Modules.USER])
  @SetMetadata('permissions', [Permissions.READ, Permissions.UPDATE])
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: StatusCodeEnum.CREATED,
    description: ResponseMessage.USER_CREATED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  @UsePipes(new YupValidationPipe(createSchema))
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Update user details, role, and permissions.
   * This endpoint allows updating an existing user by their ID. It validates the `updateUserDto`
   * using the Yup validation schema `updateSchema`.
   */
  @Put(':id')
  @SetMetadata('roles', [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.USER])
  @SetMetadata('module', [Modules.USER])
  @SetMetadata('permissions', [Permissions.UPDATE])
  @ApiOperation({ summary: 'Update user details, role, and permissions' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.USER_UPDATED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  @UsePipes(new YupValidationPipe(updateSchema))
  async updateUser(
    // @Param('id') id: string,
    @Param('id', ParseUUIDPipe) id: string, // Ensures ID is a valid UUID
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Soft delete user by ID.
   * This endpoint allows soft deletion of a user, marking them as deleted in the database.
   */
  @Delete(':id')
  @SetMetadata('roles', [Roles.ADMIN, Roles.SUPER_ADMIN])
  @SetMetadata('module', [Modules.USER])
  @SetMetadata('permissions', [Permissions.DELETE])
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.USER_SOFT_DELETED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  async softDeleteUser(@Param('id') id: string) {
    return this.userService.softDelete(id);
  }

  /**
   * Get users with pagination, search, and filters.
   * This endpoint allows fetching users with optional filters, search, and pagination.
   * It supports queries like search terms and custom filters.
   */
  @Get()
  @SetMetadata('roles', [Roles.ADMIN, Roles.SUPER_ADMIN, Roles.USER])
  @SetMetadata('module', [Modules.USER])
  @SetMetadata('permissions', [Permissions.READ])
  @ApiOperation({ summary: 'Get users with pagination, search, and filters' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.USERS_FETCHED,
  })
  @ApiResponse({
    status: StatusCodeEnum.BAD_REQUEST,
    description: ResponseMessage.BAD_REQUEST,
  })
  async getUsers(
    @Query()
    query: FindUserDto,
  ) {
    return await this.userService.getUsers(query);
  }

  /**
   * Send an email.
   * This endpoint allows sending emails to users with specific details.
   * It is primarily for testing email functionality.
   */
  @Post('send-email')
  @SetMetadata('roles', [Roles.USER])
  async sendEmail(
    @Body()
    body: SendEmailDto,
  ) {
    return this.emailService.sendEmail(body.to, body.subject, body.text);
  }

  // // ADD PRODUCT ROUTE
  // @Version('1')
  // @Post('add-product')
  // @SetMetadata('module', Modules.Order)
  // @SetMetadata('roles', [Roles.ADMIN])
  // @SetMetadata('permissions', [Permissions.READ, Permissions.CREATE])
  // addProductV1(@Body() body: { productName: string }) {
  //   return { message: `Product ${body.productName} added successfully V1` };
  // }

  // @Version('2')
  // @Post('add-product')
  // @SetMetadata('roles', [Roles.ADMIN])
  // @SetMetadata('permissions', [Permissions.CREATE])
  // @SetMetadata('module', Modules.Order)
  // addProductV2(@Body() body: { productName: string }) {
  //   return { message: `Product ${body.productName} added successfully V2` };
  // }

  // // SEND-MESSAGE TEST ROUTE
  // @Post('send-msg')
  // @SetMetadata('roles', [Roles.USER])
  // async sendMessage(@Body() body: { to: string; message: string }) {
  //   return this.smsService.sendSms(body.to, body.message);
  // }
}
