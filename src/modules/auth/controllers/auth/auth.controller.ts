import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common';
import { User } from 'src/db/schemas/user.schema';
import { CreateUserDto } from '../../dto/create-user.dto';
import { AuthCredentialsDto } from '../../dto/auth-credentials.dto';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.authService.login(authCredentialsDto);
  }
}
