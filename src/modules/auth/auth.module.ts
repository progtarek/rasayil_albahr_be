import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { AuthController } from './controllers/auth/auth.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from 'src/db/schemas/user.schema';

@Module({
  imports: [TypegooseModule.forFeature([User])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
