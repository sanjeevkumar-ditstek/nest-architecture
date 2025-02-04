// common/interceptors/response.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDto } from './response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        console.log('data: ', data);
        // Check if the response is an error
        if (data instanceof Error) {
          return new ResponseDto<T>(
            null,
            data.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        return new ResponseDto<T>(data, 'Success', HttpStatus.OK);
      }),
    );
  }
}
