import { UserStatusDTO } from './../DTOs/update-user-status.dto';
import { AuthGuard } from '@nestjs/passport';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UsersService } from './../services/users.service';
import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/modules/messages/decorators/AuthenticatedUser.decorator';
import { ProfilePictureUrlDTO } from '../DTOs/update-profile-picture.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('profile-picture')
  @UseGuards(AuthGuard())
  async UpdateProfilePicture(
    @Body(ValidationPipe) profilePictureUrlDTO: ProfilePictureUrlDTO,
    @AuthenticatedUser() user,
  ): Promise<ProfilePictureUrlDTO> {
    return this.usersService.UpdateProfilePicture(
      user._id,
      profilePictureUrlDTO,
    );
  }

  @Patch('status')
  @UseGuards(AuthGuard())
  async UpdateUseStatus(
    @Body(ValidationPipe) userStatusDTO: UserStatusDTO,
    @AuthenticatedUser() user,
  ): Promise<UserStatusDTO> {
    return this.usersService.UpdateUserStatus(user._id, userStatusDTO);
  }
}
