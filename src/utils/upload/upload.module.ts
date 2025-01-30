import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ConfigModule } from '../../config/config.module';
import { AwsConfigService } from './aws.config';

@Module({
  imports: [ConfigModule],
  providers: [UploadService, AwsConfigService],
  exports: [UploadService],
})
export class UploadModule {}
