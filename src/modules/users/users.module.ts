import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from 'src/db/schemas/user.schema';

@Module({
  imports: [TypegooseModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
