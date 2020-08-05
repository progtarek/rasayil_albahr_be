import { Prop, modelOptions, pre } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';

@pre<User>('save', async function() {
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @Prop({
    trim: true,
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  })
  username: string;

  @Prop({
    trim: true,
    type: String,
    minlength: 2,
    maxlength: 20,
  })
  firstName: string;

  @Prop({
    trim: true,
    type: String,
    minlength: 2,
    maxlength: 20,
  })
  lastName: string;

  @Prop({
    trim: true,
    type: String,
    lowercase: true,
    required: false,
  })
  email: string;

  @Prop({
    trim: true,
    type: String,
    required: true,
  })
  mobile: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    trim: true,
  })
  fcmToken: string;

  @Prop({
    type: String,
    required: false,
  })
  googleId: string;

  @Prop({
    type: String,
    required: false,
  })
  isGoogleAuthorized: Boolean;

  @Prop({
    type: String,
    enum: ['MALE', 'FEMALE'],
  })
  gender: 'MALE' | 'FEMALE';

  @Prop({ required: false })
  avatar: string;

  @Prop({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';

  public async comparePassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw error;
    }
  }
}
