import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './apps/auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LoggerModule } from './common/logger/logger.module';
import { Role, RoleSchema } from './db/schemas/role.schema';
import { User, UserSchema } from './db/schemas/user.schema';
import { UserModule } from './apps/user/user.module';
import { EmailModule } from './utils/email/email.module';
import { SmsModule } from './utils/sms/sms.module';
import { UploadModule } from './utils/upload/upload.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { NotificationsModule } from './utils/notifications/notifications.module';
import { CrudModule } from './apps/crud/crud.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
      }),
    }),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    AuthModule,
    UserModule,
    LoggerModule,
    EmailModule,
    SmsModule,
    UploadModule,
    NotificationsModule,
    CrudModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
