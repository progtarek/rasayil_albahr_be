import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from '../../dto/jwt-payload.dto';
import { InjectModel } from 'nestjs-typegoose';
import { User } from 'src/db/schemas/user.schema';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class StrategyService extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {
    super({
      secretOrKey: configService.get('AUTH_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadDto): Promise<User> {
    const { _id } = payload;
    const user = await this.userModel.findById(_id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
