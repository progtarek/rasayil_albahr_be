import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from '../../services/messages/messages.service';
import { SendMessagePayloadDto } from '../../dto/sendMessagePayload.dto';
import { AuthGuard } from '@nestjs/passport';
import { Message } from 'src/db/schemas/message.schema';

@Controller('messages')
@UseGuards(AuthGuard())
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @Post('send')
  async send(
    @Body(ValidationPipe) sendMessageDto: SendMessagePayloadDto,
    @Req() req,
  ): Promise<Message> {
    return this.messageService.send(sendMessageDto, req.user._id);
  }
}
