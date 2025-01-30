import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CrudService } from './crud.service';
import { User, UserSchema } from '../../db/schemas/user.schema';
import { Role, RoleSchema } from '../../db/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ]
})

export class CrudModule {}
