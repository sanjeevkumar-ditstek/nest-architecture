import { Injectable } from '@nestjs/common';
import { AwsConfigService } from './aws.config';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class UploadService {
  constructor(
    private awsConfigService: AwsConfigService,
    private configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer } = file;
    const s3 = this.awsConfigService.getS3();

    const uploadParams = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: originalname,
      Body: buffer,
    };

    try {
      const data = await s3.upload(uploadParams).promise();
      return data.Location; // The URL of the uploaded file
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
  async deleteFile(fileName: string): Promise<void> {
    const s3 = this.awsConfigService.getS3();

    const deleteParams = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
    };

    try {
      await s3.deleteObject(deleteParams).promise();
    } catch (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }
  async generatePresignedUrl(
    fileName: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const s3 = this.awsConfigService.getS3();

    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Expires: expiresIn, // URL expiration time in seconds
    };

    try {
      const url = await s3.getSignedUrlPromise('getObject', params);
      return url; // The presigned URL
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }
}
