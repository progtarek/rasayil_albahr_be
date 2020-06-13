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
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  })
  username: string;

  @Prop({
    trim: true,
    lowercase: true,
    required: false,
  })
  email: string;

  @Prop({
    trim: true,
  })
  fcmToken: string;

  @Prop({
    trim: true,
    lowercase: true,
    required: false,
  })
  mobile: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: false,
  })
  googleId: string;

  @Prop({
    required: false,
  })
  isGoogleAuthorized: Boolean;

  @Prop()
  gender: 'MALE' | 'FEMALE';

  @Prop({ required: false })
  profilePictureUrl: string;

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

// UserSchema.methods.generateJWT = function (JWT_SECRET) {
//   const payload = {
//     _id: this._id,
//     role: this.role,
//   };

//   return new Promise((resolve, reject) => {
//     jsonwebtoken.sign(
//       payload,
//       JWT_SECRET,
//       { expiresIn: "1y" },
//       (error, token) => {
//         if (error || !token) return reject(error);

//         return resolve(token);
//       }
//     );
//   });
// };
