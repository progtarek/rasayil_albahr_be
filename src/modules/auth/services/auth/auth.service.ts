import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from 'src/db/schemas/user.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateUserDto } from '../../dto/create-user.dto';
import { AuthCredentialsDto } from '../../dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    try {
      await user.save();
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }

  async login(authCredentials: AuthCredentialsDto): Promise<User> {
    const { mobile, password } = authCredentials;
    const user = await this.userModel.findOne({ mobile });
    if (user && !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
