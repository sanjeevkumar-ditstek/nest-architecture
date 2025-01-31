import { Get, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'; // Change from @nestjs/mongoose to @nestjs/sequelize
import { User } from '../../db/schemas/user.schema'; // Assuming you have a Sequelize model for User
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {} // Injecting Sequelize model

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile() {
    return { message: 'This is a protected route' };
  }
}
