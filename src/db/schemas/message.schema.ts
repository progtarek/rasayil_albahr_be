import { Prop, modelOptions, Ref, plugin } from '@typegoose/typegoose';
import { User } from './user.schema';
import * as mongoosePaginate from 'mongoose-paginate';

@plugin(mongoosePaginate)
@modelOptions({ schemaOptions: { timestamps: true } })
export class Message {
  @Prop({
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 500,
  })
  message: string;

  @Prop({ ref: 'User', required: true })
  sender!: Ref<User>;

  @Prop({ ref: 'User', required: true })
  receiver!: Ref<User>;

  @Prop({ default: true })
  visible: boolean;
}
