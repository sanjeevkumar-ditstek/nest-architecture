import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../db/schemas/user.schema';
import { Op } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import StatusCodeEnum from 'src/common/enums/StatusCodeEnum';
import {
  createUserRequest,
  loginRequest,
  loginResponse,
  updateUserResponse,
} from '../../common/interface/user.interface';
import { UpdateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-User.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
    // private readonly googleStrategy: GoogleStrategy,
    // getghhjhghg
  ) {}

  async register(
    createUserRequest: createUserRequest,
  ): Promise<User | { message: string }> {
    try {
      const { userName, email, password } = createUserRequest;
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      // Check if the user already exists
      if (existingUser) {
        // logger.error(ResponseMessage.userAlreadyExist)
        return { message: ResponseMessage.userAlreadyExist };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.create({
        email,
        password: hashedPassword,
        userName,
      });
      logger.info('User successfully craeted');
      return user;
    } catch (error) {
      logger.error('failed to created usr');
      logger.error(ResponseMessage.failedToCreateGroup, error.stack); // Log error with stack trace
      throw new BadRequestException('Error registering user');
    }
  }

  // Login user and generate JWT token
  async login(loginRequest: loginRequest): Promise<loginResponse> {
    try {
      const { email, password } = loginRequest;

      // Find the user
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        // logger.warn(`User with email ${email} not found`);
        throw new BadRequestException(ResponseMessage.INVALID_CREDENTIALS);
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        // this.logger.warn(
        //   `Invalid password attempt for user with email: ${email}`,
        // );
        throw new BadRequestException(ResponseMessage.INVALID_CREDENTIALS);
      }

      // Generate JWT token
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);
      // this.logger.log(`User with email ${email} logged in successfully`);
      return { token };
    } catch (error) {
      logger.error(ResponseMessage.failedToLoginUser, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToLoginUser);
    }
  }

  // Social login handler (Google in this case)
  // async socialLogin(provider: string, providerToken: string) {
  //   switch (provider) {
  //     case 'google':
  //       return this.googleStrategy.validateToken(providerToken);
  //     // case 'apple':
  //     //   return this.googleStrategy.validateToken(providerToken);
  //     // case 'facebook':
  //     //   return this.googleStrategy.validateToken(providerToken);
  //     default:
  //       // this.logger.error('Unsupported social provider: ' + provider);
  //       logger.error(ResponseMessage.unsupportedSocialProvider)
  //       throw new BadRequestException('Unsupported social provider');
  //   }
  // }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<updateUserResponse> {
    try {
      const user = await this.userRepository.findByPk(id);
      //  console.log(user,'user')
      if (!user) {
        throw new BadRequestException(ResponseMessage.userNotFound);
      }
      await user.update(updateUserDto);

      return user;
    } catch (error) {
      logger.error(ResponseMessage.failedToUpdateUser, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToUpdateUser);
    }
  }

  async softDeleteUser(id: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new BadRequestException(ResponseMessage.userNotFound);
      }
      user.isDeleted = true;
      await user.save();

      return {
        statusCode: StatusCodeEnum.OK,
        message: ResponseMessage.userSoftDeletd,
        id: user.id,
      };
    } catch (error) {
      logger.error(ResponseMessage.failedToSoftDelete, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.failedToSoftDelete);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id, isDeleted: false },
      });
      if (!user) {
        throw new BadRequestException(ResponseMessage.userNotFound);
      }

      // this.logger.log(`User with ID ${id} retrieved successfully`);
      return user;
    } catch (error) {
      logger.error(ResponseMessage.failedToFetched, error.stack); // Log error with stack trace
      throw new BadRequestException(ResponseMessage.userNotFound);
    }
  }

  async getUsers(query: FindUserDto): Promise<any> {
    try {
      // Destructure query with default values
      const {
        search,
        sort = 'Desc',
        filters = {},
        pageNumber = 1,
        pageSize = 10,
      } = query;

      const limit = Number(pageSize); // Convert page size to a number
      const offset = (Number(pageNumber) - 1) * limit; // Calculate offset based on page number

      // Base where condition for non-deleted users
      const condition: any = { isDeleted: false };

      // Dynamic search: Allow search across multiple fields
      if (search) {
        condition[Op.or] = [
          { email: { [Op.like]: `%${search}%` } },
          { UserName: { [Op.like]: `%${search}%` } },
        ];
      }

      // Handle dynamic filters
      const parsedFilters = filters || {};
      Object.entries(parsedFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          // Skip empty or undefined filters to avoid overriding defaults
          return;
        }
        if (typeof value === 'object' && value !== null) {
          condition[key] = { ...value }; // Operator-based filters (e.g., range, greater than)
        } else {
          condition[key] = value; // Exact match filters
        }
      });

      // Sort order
      const order: any =
        sort === 'Desc' ? [['createdAt', 'DESC']] : [['createdAt', 'ASC']];
      console.log(condition, 'condition');
      // Fetch users from the repository with pagination and filtering
      const { rows: users, count: totalUsers } =
        await this.userRepository.findAndCountAll({
          where: condition,
          limit,
          offset,
          order,
        });

      // Return the response with pagination details
      return {
        statusCode: StatusCodeEnum.OK,
        message: ResponseMessage.userFetched,
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: Number(pageNumber),
      };
    } catch (error) {
      logger.error('Error fetching users', error.stack); // Log error with stack trace
      if (error instanceof BadRequestException) {
        throw error; // Rethrow if it’s a known exception
      }
      // throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}
