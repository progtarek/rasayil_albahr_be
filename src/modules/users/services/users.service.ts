import { User } from './../../../db/schemas/user.schema';
import { InjectModel } from 'nestjs-typegoose';
import { Injectable } from '@nestjs/common';
import { ProfilePictureUrlDTO } from '../DTOs/update-profile-picture.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel) {}

  public async UpdateProfilePicture(
    _id: string,
    profilePictureUrlDTO: ProfilePictureUrlDTO,
  ): Promise<ProfilePictureUrlDTO> {
    await this.userModel.updateOne(
      { _id },
      { profilePictureUrl: profilePictureUrlDTO.profilePictureUrl },
    );
    return profilePictureUrlDTO;
  }
}
