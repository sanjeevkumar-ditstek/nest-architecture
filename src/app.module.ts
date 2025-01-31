import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { User } from './db/schemas/user.schema';
import { Permission } from './db/schemas/permissions.schema';
import { Role } from './db/schemas/role.schema';
import { EmailModule } from './common/utils/email/email.module';
import { UserModule } from './apps/user/user.module';
import { UserRole } from './db/schemas/userRole.schema';
import { RoleModule } from './apps/role/role.module';
import { PermissionnModule } from './apps/permission/permssion.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: configService.get('DB_DIALECT') as
          | 'mysql'
          | 'postgres'
          | 'sqlite'
          | 'mariadb', // Ensure strong typing
        host: configService.get('DB_HOST') as string,
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME') as string,
        password: configService.get('DB_PASSWORD') as string,
        database: configService.get('DB_DATABASE') as string,
        models: [User, Permission, Role, UserRole],
        autoLoadModels: true,
      }),
    }),
    AppModule,
    EmailModule,
    UserModule,
    RoleModule,
    PermissionnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
