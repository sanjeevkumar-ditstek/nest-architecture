import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import ResponseMessage from 'src/common/enums/ResponseMessages';
import logger from 'src/common/logger/logger.service';
import {
  createUserRequest,
  loginRequest,
  loginResponse,
} from '../../common/interface/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user.
   * @param createUserRequest - The request payload containing user details (userName, email, password).
   * @returns The created user object or a message if the user already exists.
   * @throws BadRequestException if registration fails.
   */
  async register(
    createUserRequest: createUserRequest,
  ): Promise<User | { message: string }> {
    try {
      const { userName, email, password } = createUserRequest;
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        return { message: ResponseMessage.USER_ALREADY_EXISTS };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        userName,
      });
      await this.userRepository.save(user);
      logger.info('User successfully created');
      return user;
    } catch (error) {
      logger.error(ResponseMessage.USER_REGISTRATION_ERROR, error.stack);
      throw new BadRequestException('Error registering user');
    }
  }

  /**
   * Logs in a user by validating credentials and generating a JWT token.
   * @param loginRequest - The request payload containing email and password.
   * @returns A JWT token if authentication is successful, or an error message if invalid credentials are provided.
   * @throws BadRequestException if login fails.
   */
  async login(
    loginRequest: loginRequest,
  ): Promise<loginResponse | { message: string }> {
    try {
      const { email, password } = loginRequest;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return { message: ResponseMessage.INVALID_CREDENTIALS };
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { message: ResponseMessage.INVALID_CREDENTIALS };
      }
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);
      return { token };
    } catch (error) {
      logger.error(ResponseMessage.FAILED_TO_LOGIN_USER, error.stack);
      throw new BadRequestException(ResponseMessage.FAILED_TO_LOGIN_USER);
    }
  }
}

//   async updateUser(id: string, updateUserDto: updateUserResponse): Promise<{ message: string }> {
//     try {
//       const user = await this.userRepository.findOne({ where: { id } });
//       if (!user) {
//         console.log(user, 'user');
//         return { message: ResponseMessage.userNotFound };
//       }

//       await this.userRepository.update(id, updateUserDto);

//       return { message: ResponseMessage.userUpdated };
//     } catch (error) {
//       logger.error(ResponseMessage.failedToUpdateUser, error.stack);
//       throw new BadRequestException(ResponseMessage.failedToUpdateUser);
//     }
//   }

//   async softDeleteUser(id: string): Promise<any> {
//     try {
//       const user = await this.userRepository.findOne({ where: { id } });
//       if (!user) {
//         return { message: ResponseMessage.userNotFound };
//       }
//       user.isDeleted = true;
//       await this.userRepository.save(user);
//       return {
//         message: ResponseMessage.SoftDeletd,
//       };
//     } catch (error) {
//       logger.error(ResponseMessage.failedToSoftDelete, error.stack);
//       throw new BadRequestException(ResponseMessage.failedToSoftDelete);
//     }
//   }

//   async get(id: string): Promise<User | { message: string }> {
//     try {
//       const user = await this.userRepository.findOne({
//         where: { id, isDeleted: false },
//       });
//       if (!user) {
//         return { message: ResponseMessage.userNotFound };
//       }
//       return user;
//     } catch (error) {
//       logger.error(ResponseMessage.failedToFetched, error.stack);
//       throw new BadRequestException(ResponseMessage.userNotFound);
//     }
//   }

//   // async getUsers(query: FindUserDto): Promise<any> {
//   //   try {
//   //     const {
//   //       search,
//   //       sort = 'Desc',
//   //       filters = {},
//   //       pageNumber = 1,
//   //       pageSize = 10,
//   //     } = query;

//   //     const limit = Number(pageSize);
//   //     const offset = (Number(pageNumber) - 1) * limit;

//   //     const condition: any = { isDeleted: false };

//   //     if (search) {
//   //       condition.action = { $like: `%${search}%` };
//   //     }

//   //     const parsedFilters = filters || {};
//   //     Object.entries(parsedFilters).forEach(([key, value]) => {
//   //       if (value === undefined || value === null || value === '') {
//   //         return;
//   //       }
//   //       condition[key] = value;
//   //     });

//   //     const order = sort === 'Desc' ? 'DESC' : 'ASC';

//   //     const [users, totalPermissions] = await this.userRepository.findAndCount({
//   //       where: condition,
//   //       take: limit,
//   //       skip: offset,
//   //       // order: { createdAt: order },
//   //     });

//   //     return {
//   //       users,
//   //       totalPermissions,
//   //       totalPages: Math.ceil(totalPermissions / limit),
//   //       currentPage: Number(pageNumber),
//   //     };
//   //   } catch (error) {
//   //     logger.error(ResponseMessage.failedToFetchedPermission, error.stack);
//   //     throw new BadRequestException(ResponseMessage.failedToFetched);
//   //   }
//   // }

// }
