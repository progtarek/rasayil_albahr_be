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
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    const { username, email } = createUserDto;
    const existed = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existed) {
      throw new ConflictException('User already exists');
    } else {
      const user = new this.userModel(createUserDto);
      await user.save();
    }
  }

  async login(
    authCredentials: AuthCredentialsDto,
  ): Promise<{ token: string; username: string }> {
    const { username, password } = authCredentials;
    const user = await this.userModel.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const jwtPayload: JwtPayloadDto = {
      username: user.username,
      _id: user._id,
    };
    const token = await this.jwtService.sign(jwtPayload);
    return { token, username: user.username };
  }
}
