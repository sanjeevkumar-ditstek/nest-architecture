import {
  Controller,
  UseGuards,
  SetMetadata,
  Post,
  Body,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Roles from 'src/common/enums/role';
import Permissions from 'src/common/enums/permission';
import Modules from 'src/common/enums/modules';
import { EmailService } from 'src/common/utils/email/email.service';
import { SmsService } from 'src/common/utils/sms/sms.service';
import { SendEmailDto } from '../auth/dto/send-email.dto';
import { RolesGuard } from 'src/common/gaurds/role-gaurd';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  // ADD PRODUCT ROUTE
  @Version('1')
  @Post('add-product')
  @SetMetadata('module', Modules.Order)
  @SetMetadata('roles', [Roles.ADMIN])
  @SetMetadata('permissions', [Permissions.READ, Permissions.CREATE])
  addProductV1(@Body() body: { productName: string }) {
    return { message: `Product ${body.productName} added successfully V1` };
  }

  @Version('2')
  @Post('add-product')
  @SetMetadata('roles', [Roles.ADMIN])
  @SetMetadata('permissions', [Permissions.CREATE])
  @SetMetadata('module', Modules.Order)
  addProductV2(@Body() body: { productName: string }) {
    return { message: `Product ${body.productName} added successfully V2` };
  }

  // SEND-EMAIL TEST ROUTE
  @Post('send-email')
  @SetMetadata('roles', [Roles.USER])
  async sendEmail(
    @Body()
    body: SendEmailDto,
  ) {
    return this.emailService.sendEmail(body.to, body.subject, body.text);
  }

  // SEND-MESSAGE TEST ROUTE
  @Post('send-msg')
  @SetMetadata('roles', [Roles.USER])
  async sendMessage(@Body() body: { to: string; message: string }) {
    return this.smsService.sendSms(body.to, body.message);
  }
}
