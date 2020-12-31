import { UserLocationDTO } from './../DTOs/user-location.DTO';
import { UserStatusDTO } from './../DTOs/update-user-status.dto';
import { User } from './../../../db/schemas/user.schema';
import { InjectModel } from 'nestjs-typegoose';
import { Injectable } from '@nestjs/common';
import { ProfilePictureUrlDTO } from '../DTOs/update-profile-picture.dto';
import { Types } from 'mongoose';
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

  public async UpdateUserStatus(
    _id: string,
    userStatusDTO: UserStatusDTO,
  ): Promise<UserStatusDTO> {
    await this.userModel.updateOne({ _id }, { status: userStatusDTO.status });
    return userStatusDTO;
  }

  public async UpdateUserLocation(
    _id: string,
    userLocationDTO: UserLocationDTO,
  ): Promise<any> {
    await this.userModel.updateOne(
      { _id },
      { location: [userLocationDTO.longitude, userLocationDTO.latitude] },
    );
  }

  public async Discover(
    _id: string,
    userLocationDTO: UserLocationDTO,
  ): Promise<User[]> {
    const users = await this.userModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [userLocationDTO.longitude, userLocationDTO.latitude],
          },
          distanceField: 'distance',
          maxDistance: 1000,
          query: { _id: { $ne: Types.ObjectId(_id) } },
          spherical: true,
        },
      },
      {
        $project: {
          _id: 0,
          username: 1,
          distance: 1,
        },
      },
    ]);
    return users;
  }
}
