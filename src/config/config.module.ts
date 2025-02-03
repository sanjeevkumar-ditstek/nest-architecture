import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: () => {
        return new ConfigService('.env');
      },
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
