import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../db/entity/user.entity';
import { Role } from '../../db/entity/role.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../../common/utils/email/email.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { SmsModule } from 'src/common/utils/sms/sms.module';
import { Permission } from 'src/db/entity/permissions.entity';
import { UserRole } from 'src/db/entity/userRole.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseModel } from 'src/db/entity/base.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, UserRole, BaseModel]),
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
