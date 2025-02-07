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
