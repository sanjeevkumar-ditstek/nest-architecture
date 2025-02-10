import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { User } from './db/entity/user.entity';
import { Permission } from './db/entity/permissions.entity';
import { Role } from './db/entity/role.entity';
import { UserRole } from './db/entity/userRole.entity';
import { EmailModule } from './common/utils/email/email.module';
import { PermissionnModule } from './apps/permission/permssion.module';
import { AuthModule } from './apps/auth/auth.module';
import { RoleModule } from './apps/role/role.module';
import { UserModule } from './apps/user/user.module';
import { BaseEntity } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: String(configService.get('DB_HOST')),
        port: Number(configService.get('DB_PORT')),
        username: String(configService.get('DB_USERNAME')),
        password: String(configService.get('DB_PASSWORD')),
        database: String(configService.get('DB_DATABASE')),
        entities: [User, Permission, Role, UserRole, BaseEntity],
        synchronize: true,
      }),
    }),
    EmailModule,
    RoleModule,
    AuthModule,
    UserModule,
    PermissionnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
