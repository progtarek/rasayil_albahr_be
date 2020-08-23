import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookService extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      graphAPIVersion: 'v2.12',
      profileFields: ['id', 'name', 'email', 'gender', 'picture{url}'],
      callbackURL: `${configService.get(
        'SEA_MESSAGES_BE_URL',
      )}/auth/facebook-redirect`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user = { profile, accessToken };
    done(null, user);
  }
}
