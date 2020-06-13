import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Req,
  UseGuards,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { MessagesService } from '../../services/messages/messages.service';
import { SendMessagePayloadDto } from '../../dto/sendMessagePayload.dto';
import { AuthGuard } from '@nestjs/passport';
import { Message } from 'src/db/schemas/message.schema';
import { ReadManyQueryDto } from '../../dto/readManyQuery.dto';
import { AuthenticatedUser } from '../../decorators/AuthenticatedUser.decorator';

@Controller('messages')
@UseGuards(AuthGuard())
export class MessagesController {
  constructor(private messageService: MessagesService) {}

  @Post('send')
  async send(
    @Body(ValidationPipe) sendMessageDto: SendMessagePayloadDto,
    @AuthenticatedUser() user,
  ): Promise<void> {
    return this.messageService.send(sendMessageDto, user._id);
  }

  @Get('')
  async findAll(
    @AuthenticatedUser() user,
    @Query() query: ReadManyQueryDto,
  ): Promise<Message[]> {
    return this.messageService.findAll(user._id, query);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @AuthenticatedUser() user,
  ): Promise<void> {
    return this.messageService.delete(user._id, id);
  }
}
