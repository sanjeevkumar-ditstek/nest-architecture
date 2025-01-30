import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import axios from 'axios';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'), // Update this as needed
      passReqToCallback: true,
    }); 
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }

  async validateToken(token: string) {
    const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`;
    const response = await axios.get(url);
    return response.data;
  }
}
