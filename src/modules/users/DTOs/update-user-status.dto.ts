import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserStatusDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(100)
  status: string;
}
