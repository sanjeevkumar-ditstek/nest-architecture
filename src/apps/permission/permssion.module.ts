import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { User } from '../../db/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from 'src/db/schemas/permissions.schema';
import { Role } from 'src/db/schemas/role.schema';
import { UserRole } from 'src/db/schemas/userRole.schema';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, Role, UserRole]),
    PassportModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionnModule {}
