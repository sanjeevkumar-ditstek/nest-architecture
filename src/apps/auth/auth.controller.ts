import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Post('social-login')
  async socialLogin(@Body() body: { provider: string; providerToken: string }) {
    const { provider, providerToken } = body;
    return this.authService.socialLogin(provider, providerToken);
  }
}
