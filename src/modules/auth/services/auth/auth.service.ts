import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
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
    private configService: ConfigService,
  ) {}

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  getRandomPassword() {
    let numberChars = '0123456789';
    let upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    let specialChars = '#$_-@!%&*?';

    let allChars = numberChars + upperChars + lowerChars + specialChars;

    let randPasswordArray = Array(20);

    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = specialChars;

    randPasswordArray = randPasswordArray.fill(allChars, 4);

    return this.shuffleArray(
      randPasswordArray.map(function(x) {
        return x[Math.floor(Math.random() * x.length)];
      }),
    ).join('');
  }

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
  ): Promise<{ token: string; username: string; profilePictureUrl: string }> {
    const { email, password } = authCredentials;
    const user = await this.userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const jwtPayload: JwtPayloadDto = {
      username: user.username,
      _id: user._id,
    };
    const token = await this.jwtService.sign(jwtPayload);
    return {
      token,
      username: user.username,
      profilePictureUrl: user.profilePictureUrl,
    };
  }

  async googleLogin(req) {
    try {
      if (!req.user) {
        throw new NotFoundException('User not found');
      }

      const { id, name, emails, photos } = req.user.profile;
      let payload: any = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        username: new Date().getTime(),
        googleId: id,
        isEmailVerified: true,
        password: this.getRandomPassword(),
        profilePictureUrl: photos[0].value,
      };

      let exist = await this.userModel.findOne({
        email: emails[0].value,
        googleId: id,
      });

      let user = exist ? exist : await this.userModel.create(payload);
      const token = await this.jwtService.sign({
        username: user.username,
        _id: user._id,
      });

      return {
        url: `${this.configService.get(
          'SEA_MESSAGES_CLIENT_URL',
        )}?username=${encodeURIComponent(
          user.username,
        )}&token=${encodeURIComponent(
          token,
        )}&profilePictureUrl=${encodeURIComponent(user.profilePictureUrl)}`,
      };
    } catch (error) {
      Logger.log('Failed to login with google', 'GOOGLE_LOGIN', true);
      console.error('Failed to login with google', error);
      throw new InternalServerErrorException('Failed to sign in with google');
    }
  }

  async facebookLogin(req) {
    try {
      if (!req.user) {
        throw new NotFoundException('User not found');
      }

      const { id, name, emails, photos, gender } = req.user.profile;
      let payload: any = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        username: new Date().getTime(),
        facebookId: id,
        isEmailVerified: true,
        gender:
          gender.toUpperCase() === 'MALE' || 'FEMALE'
            ? gender.toUpperCase()
            : 'OTHERS',
        password: this.getRandomPassword(),
        profilePictureUrl: photos[0].value,
      };

      let exist = await this.userModel.findOne({
        email: emails[0].value,
        facebookId: id,
      });

      let user = exist ? exist : await this.userModel.create(payload);
      const token = await this.jwtService.sign({
        username: user.username,
        _id: user._id,
      });

      return {
        url: `${this.configService.get(
          'SEA_MESSAGES_CLIENT_URL',
        )}?username=${encodeURIComponent(
          user.username,
        )}&token=${encodeURIComponent(
          token,
        )}&profilePictureUrl=${encodeURIComponent(user.profilePictureUrl)}`,
      };
    } catch (error) {
      Logger.log('Failed to login with facebook', 'FACEBOOK_LOGIN');
      console.error('Failed to login with facebook', error);
      throw new InternalServerErrorException('Failed to sign in with facebook');
    }
  }
}
