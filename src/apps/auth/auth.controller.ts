import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Delete,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto } from '../auth/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { loginSchema, createSchema } from './schema/register.schema';
import { YupValidationPipe } from 'src/common/validations/yup-validation.pipe';
import { AuthGuard } from '../../common/authgaurd/authentication';
import { Query } from '@nestjs/common';
import { FindUserDto } from './dto/find-User.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new YupValidationPipe(createSchema))
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new YupValidationPipe(loginSchema))
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // @Post('social-login')
  // async socialLogin(@Body() body: { provider: string; providerToken: string }) {
  //   const { provider, providerToken } = body;
  //   return this.authService.socialLogin(provider, providerToken);
  // }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @Put(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a user' })
  @ApiResponse({ status: 200, description: 'User soft deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async softDeleteUser(@Param('id') id: string) {
    return await this.authService.softDeleteUser(id);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get users with pagination, search, and filters' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getUsers(
    @Query()
    query: FindUserDto,
  ) {
    return await this.authService.getUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }
}
