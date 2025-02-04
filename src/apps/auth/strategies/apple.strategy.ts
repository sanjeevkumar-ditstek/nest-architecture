// auth/strategies/apple.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-apple';
import { AuthService } from '../auth.service'; // Adjust the path as necessary
import { User } from '../../../db/schemas/user.schema'; // Adjust the path as necessary
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('APPLE_CLIENT_ID'),
      teamID: configService.get('APPLE_TEAM_ID'),
      keyID: configService.get('APPLE_KEY_ID'),
      privateKey: configService.get('APPLE_PRIVATE_KEY').replace(/\\n/g, '\n'), // Handle newline characters
      callbackURL: configService.get('APPLE_CALLBACK_URL'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    const { email, firstName, lastName } = profile;

    const user = {
      email: email,
      //   firstName: firstName,
      //   lastName: lastName,
      // Add additional fields if necessary
    };

    const userFromDb = await this.authService.validateUser(user);
    done(null, userFromDb || user);
  }
}
