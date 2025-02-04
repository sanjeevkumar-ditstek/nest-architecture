import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { User, UserDocument } from '../../db/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService extends CrudService<UserDocument> {
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }
}
