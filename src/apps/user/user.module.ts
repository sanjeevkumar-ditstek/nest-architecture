import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../db/schemas/user.schema';
import { Role } from '../../db/schemas/role.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../../common/utils/email/email.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { SmsModule } from 'src/common/utils/sms/sms.module';
import { Permission } from 'src/db/schemas/permissions.schema';
import { UserRole } from 'src/db/schemas/userRole.schema';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, UserRole]),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
    EmailModule,
    SmsModule,
    UserModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
