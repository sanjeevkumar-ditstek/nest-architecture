import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../db/schemas/user.schema';
import { Role, RoleDocument } from '../../db/schemas/role.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import { GoogleStrategy } from './strategies/google.strategy';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private jwtService: JwtService,
    private readonly googleStrategy: GoogleStrategy,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({ email, password: hashedPassword });
      this.logger.log('User data updated successfully'); // Info level
      return user.save();
    } catch (error) {
      this.logger.error('This is a log auth service', error?.message); // Info level
      throw new Error(error?.message);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user._id };
      return {
        token: this.jwtService.sign(payload),
      };
    } else {
      this.logger.error(ResponseMessage.INVALID_CREDENTIALS); // Info level
      throw new Error(ResponseMessage.INVALID_CREDENTIALS);
    }
  }

  async socialLogin(provider: string, providerToken: string) {
    switch (provider) {
      case 'google':
        return this.googleStrategy.validateToken(providerToken);
      case 'apple':
        return this.googleStrategy.validateToken(providerToken);
      case 'facebook':
        return this.googleStrategy.validateToken(providerToken);
      default:
        throw new BadRequestException('Unsupported social provider');
    }
  }

  async validateUser(profile: any): Promise<User | null> {
    console.log(profile);
    // Check if user exists in your database
    // If not, create a new user and return it
    // Return null if user not found
    return;
  }
}
