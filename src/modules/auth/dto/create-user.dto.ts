import {
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsMobilePhone,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsMobilePhone('ar-EG')
  mobile: string;
}
