import { IsString, IsUrl } from 'class-validator';

export class ProfilePictureUrlDTO {
  @IsUrl()
  @IsString()
  profilePictureUrl: string;
}
