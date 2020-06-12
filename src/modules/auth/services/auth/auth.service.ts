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
import { JwtPayloadDto } from '../../dto/jwt-payload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private jwtService: JwtService,
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

  async login(authCredentials: AuthCredentialsDto): Promise<{ token: string }> {
    const { mobile, password } = authCredentials;
    const user = await this.userModel.findOne({ mobile });
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const jwtPayload: JwtPayloadDto = { username: user.username };
    const token = await this.jwtService.sign(jwtPayload);
    return { token };
  }
}
