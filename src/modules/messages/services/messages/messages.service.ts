import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Message } from 'src/db/schemas/message.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from 'src/db/schemas/user.schema';
import { SendMessagePayloadDto } from '../../dto/sendMessagePayload.dto';
import { ReadManyQueryDto } from '../../dto/readManyQuery.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message)
    private readonly messageModel,
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  public async send(
    sendMessageDto: SendMessagePayloadDto,
    senderId: string,
  ): Promise<Message> {
    const { receiver, message } = sendMessageDto;
    const receiverUser = await this.userModel.findOne({ username: receiver });
    if (!receiverUser) {
      throw new NotFoundException('invalid receiver');
    }
    const createdMessage = new this.messageModel({
      receiver: receiverUser._id,
      sender: senderId,
      message,
    });

    return await createdMessage.save();
  }

  async findAll(sender: string, query: ReadManyQueryDto): Promise<Message[]> {
    const messages = await this.messageModel.paginate(
      { sender },
      {
        select: 'message createdAt',
        ...query,
      },
    );

    return messages;
  }
}
