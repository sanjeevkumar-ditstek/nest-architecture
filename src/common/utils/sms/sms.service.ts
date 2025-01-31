import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class SmsService {
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const provider = this.configService.get('SMS_PROVIDER');
    console.log('SMS Provider:', provider);

    if (provider === 'twilio') {
      this.twilioClient = twilio(
        this.configService.get('TWILIO_ACCOUNT_SID') as string,
        this.configService.get('TWILIO_AUTH_TOKEN') as string,
      );
    }
  }

  async sendSms(to: string, body: string) {
    const provider = this.configService.get('SMS_PROVIDER');
    console.log(this.twilioClient, 'fczdfrgty');
    if (provider === 'twilio') {
      return await this.twilioClient.messages.create({
        to,
        from: this.configService.get('TWILIO_PHONE_NUMBER') as string,
        body,
      });
    }

    throw new Error('No valid SMS provider configured.');
  }
}
