import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { MessagesService } from '../../services/messages/messages.service';
import { SendMessagePayloadDto } from '../../dto/sendMessagePayload.dto';
import { AuthGuard } from '@nestjs/passport';
import { Message } from 'src/db/schemas/message.schema';
import { ReadManyQueryDto } from '../../dto/readManyQuery.dto';

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

  @Get('')
  async findAll(@Req() req, @Query() query: ReadManyQueryDto) {
    return this.messageService.findAll(req.user._id, query);
  }
}
