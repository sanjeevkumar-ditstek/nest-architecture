import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { loginSchema, createSchema } from './schema/register.schema';
import { YupValidationPipe } from 'src/common/validations/yup-validation.pipe';
import StatusCodeEnum from 'src/common/enums/StatusCodeEnum';
import ResponseMessage from 'src/common/enums/ResponseMessages';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user.
   * @param createUserDto - The request payload containing user details.
   * @returns A success message and user details if registration is successful.
   */
  @Post('register')
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
    return this.authService.register(createUserDto);
  }

  /**
   * Logs in a user.
   * @param loginUserDto - The request payload containing user credentials.
   * @returns A success message and authentication token if login is successful.
   */
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: StatusCodeEnum.OK,
    description: ResponseMessage.USER_LOGGED_IN,
  })
  @ApiResponse({
    status: StatusCodeEnum.UNAUTHORIZED,
    description: ResponseMessage.UNAUTHORIZED,
  })
  @UsePipes(new YupValidationPipe(loginSchema))
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}

/**
 * Authenticates a user via social login.
 * @param body - The request payload containing provider name and provider token.
 * @returns A success message and authentication token if login is successful.
 */

// @Post('social-login')
// async socialLogin(@Body() body: { provider: string; providerToken: string }) {
//   const { provider, providerToken } = body;
//   return this.authService.socialLogin(provider, providerToken);
// }
