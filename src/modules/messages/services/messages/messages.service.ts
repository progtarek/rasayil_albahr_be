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

  private processReadAllQuery(payload) {
    if (payload.page) {
      payload.page = parseInt(payload.page, 10);
    }
    if (payload.limit) {
      payload.limit = parseInt(payload.limit, 10);
    }
    return payload;
  }

  public async send(
    sendMessageDto: SendMessagePayloadDto,
    senderId: string,
  ): Promise<void> {
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

    await createdMessage.save();
  }

  async findAll(sender: string, query: ReadManyQueryDto): Promise<Message[]> {
    const filters = this.processReadAllQuery(query);
    const messages = await this.messageModel.paginate(
      { sender, visible: true },
      {
        select: 'message createdAt',
        ...filters,
      },
    );

    return messages;
  }

  async delete(sender: string, _id: string): Promise<void> {
    try {
      const message = await this.messageModel.findOne({
        sender,
        _id,
      });

      await this.messageModel.updateOne(
        { _id: message._id },
        { visible: false },
      );

      if (!message) {
        throw new NotFoundException('Not found');
      }
    } catch (error) {
      throw new NotFoundException('Not found');
    }
  }
}
