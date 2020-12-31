import { Prop, modelOptions, pre, index } from '@typegoose/typegoose';
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
@index({ location: '2dsphere' })
export class User {
  @Prop({
    trim: true,
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 20,
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
    minlength: 4,
    maxlength: 100,
  })
  status: string;

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
    required: false,
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
  facebookId: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isEmailVerified: boolean;

  @Prop({
    type: String,
    enum: ['MALE', 'FEMALE'],
  })
  gender: 'MALE' | 'FEMALE' | 'OTHER';

  @Prop({ type: Number, dim: 1 })
  public location?: Array<number>;

  @Prop({ required: false })
  profilePictureUrl: string;

  @Prop({ default: 'ACTIVE' })
  activation: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';

  public async comparePassword(password: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, this.password);
    } catch (error) {
      throw error;
    }
  }
}
