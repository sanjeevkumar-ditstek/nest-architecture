import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { User } from '../../db/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from 'src/db/entity/permissions.entity';
import { Role } from 'src/db/entity/role.entity';
import { UserRole } from 'src/db/entity/userRole.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
