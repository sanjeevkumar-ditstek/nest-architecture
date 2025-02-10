import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { User } from '../../db/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/db/entity/permissions.entity';
import { Role } from 'src/db/entity/role.entity';
import { UserRole } from 'src/db/entity/userRole.entity';
import { BaseModel } from 'src/db/entity/base.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Permission, Role, UserRole, BaseModel]),
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
