import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from 'src/db/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StrategyService } from './services/strategy/strategy.service';
import { PassportModule } from '@nestjs/passport';
import { FacebookService } from './services/facebook/facebook.service';
import { GoogleService } from './services/google/google.service';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('AUTH_SECRET'),
        signOptions: {
          expiresIn: parseInt(configService.get('JWT_EXPIRE')),
        },
      }),
    }),
  ],
  providers: [AuthService, StrategyService, FacebookService, GoogleService],
  controllers: [AuthController],
  exports: [StrategyService, PassportModule],
})
export class AuthModule {}
