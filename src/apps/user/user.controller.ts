import { Controller } from '@nestjs/common';
import { CrudController } from '../crud/crud.controller';
import { User, UserDocument } from '../../db/schemas/user.schema'
import { UserService } from './user.service';
import { userValidationSchemas } from './validation/user.validation';




@Controller('users')
export class UserController extends CrudController<UserDocument> {
  constructor(private readonly userService: UserService) {
    super(userService, userValidationSchemas);
  }
}
