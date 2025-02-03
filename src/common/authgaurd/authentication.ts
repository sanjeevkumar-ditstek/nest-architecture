import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { warn } from 'console';
@Injectable()
export class AuthGuard implements CanActivate {
  // eslint-disable-next-line no-unused-vars
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException();
      }
      request.user = this.jwtService.verify(token);
    } catch (error) {
      warn(error);
      throw new UnauthorizedException();
    }
    return true;
  }
}
