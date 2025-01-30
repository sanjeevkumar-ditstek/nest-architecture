import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../../db/schemas/user.schema';
import { Role, RoleSchema } from '../../db/schemas/role.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { EmailModule } from '../../utils/email/email.module';
import { SmsModule } from '../../utils/sms/sms.module';
import { UploadModule } from '../../utils/upload/upload.module';
import { NotificationsModule } from '../../utils/notifications/notifications.module';
import { CrudModule } from '../crud/crud.module';
import { CrudService } from '../crud/crud.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
    EmailModule,
    SmsModule,
    UploadModule,
    NotificationsModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
