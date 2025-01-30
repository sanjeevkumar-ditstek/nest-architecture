import { IsEmail, IsString, IsOptional, IsArray } from 'class-validator';
import { ISendEmail } from '../interface/send-email.interface';

export class SendEmailDto implements ISendEmail {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsArray()
  attachments?: any[];
}
