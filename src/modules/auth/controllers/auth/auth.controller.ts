import { AuthCredentialsDto } from '../../dto/auth-credentials.dto';
import { AuthService } from '../../services/auth/auth.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  Req,
  Get,
  Post,
  Body,
  Redirect,
  UseGuards,
  Controller,
  ValidationPipe,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}
  CLIENT_URL = this.configService.get('SEA_MESSAGES_CLIENT_URL');

  @Post('register')
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: string; username: string; profilePictureUrl: string }> {
    return this.authService.login(authCredentialsDto);
  }

  @Get('google-login')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google-redirect')
  @UseGuards(AuthGuard('google'))
  @Redirect(this.CLIENT_URL, 302)
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('facebook-login')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {}

  @Get('facebook-redirect')
  @UseGuards(AuthGuard('facebook'))
  @Redirect(this.CLIENT_URL, 302)
  facebookAuthRedirect(@Req() req) {
    return this.authService.facebookLogin(req);
  }
}
