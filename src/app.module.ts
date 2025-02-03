// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { ConfigModule } from './config/config.module';
// import { ConfigService } from './config/config.service';
// import { User } from './db/schemas/user.schema';
// import { Permission } from './db/schemas/permissions.schema';
// import { Role } from './db/schemas/role.schema';
// import { EmailModule } from './common/utils/email/email.module';
// import { UserModule } from './apps/user/user.module';
// import { UserRole } from './db/schemas/userRole.schema';
// // import { RoleModule } from './apps/role/role.module';
// import { PermissionnModule } from './apps/permission/permssion.module';

// @Module({
//   imports: [
//     SequelizeModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         dialect: configService.get('DB_DIALECT') as
//           | 'mysql'
//           | 'postgres'
//           | 'sqlite'
//           | 'mariadb', // Ensure strong typing
//         host: configService.get('DB_HOST') as string,
//         port: Number(configService.get('DB_PORT')),
//         username: configService.get('DB_USERNAME') as string,
//         password: configService.get('DB_PASSWORD') as string,
//         database: configService.get('DB_DATABASE') as string,
//         models: [User, Permission, Role, UserRole],
//         autoLoadModels: true,
//       }),
//     }),
//     AppModule,
//     EmailModule,
//     // UserModule,
//     // RoleModule,
//     PermissionnModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { User } from './db/schemas/user.schema';
import { Permission } from './db/schemas/permissions.schema';
import { Role } from './db/schemas/role.schema';
import { UserRole } from './db/schemas/userRole.schema';
import { EmailModule } from './common/utils/email/email.module';
import { PermissionnModule } from './apps/permission/permssion.module';
import { AuthModule } from './apps/auth/auth.module';
import { RoleModule } from './apps/role/role.module';
import { UserModule } from './apps/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // or 'postgres', 'sqlite', etc.
        host: String(configService.get('DB_HOST')), // Ensure host is a string
        port: Number(configService.get('DB_PORT')), // Ensure port is a number
        username: String(configService.get('DB_USERNAME')), // Ensure username is a string
        password: String(configService.get('DB_PASSWORD')), // Ensure password is a string
        database: String(configService.get('DB_DATABASE')), // Ensure database is a string
        entities: [User, Permission, Role, UserRole], // Pass your entities here
        synchronize: true, // Set to false in production
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
