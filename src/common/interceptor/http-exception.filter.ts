// common/filters/http-exception.filter.ts

import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResponseDto } from './response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const message = exception.message || 'Internal server error';

    // Construct a standard ResponseDto for errors
    const responseDto = new ResponseDto(null, message, status);

    response.status(status).json(responseDto);
  }
}
