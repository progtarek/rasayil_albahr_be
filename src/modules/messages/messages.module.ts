import { Module } from '@nestjs/common';
import { MessagesService } from './services/messages/messages.service';
import { MessagesController } from './controllers/messages/messages.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from 'src/db/schemas/user.schema';
import { Message } from 'src/db/schemas/message.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypegooseModule.forFeature([User, Message]), AuthModule],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
