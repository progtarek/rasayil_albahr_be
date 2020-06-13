import { Prop, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user.schema';

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
}
