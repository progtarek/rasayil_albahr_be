import {
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
  IsMobilePhone,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z].*$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsNotEmpty()
  @IsMobilePhone('ar-EG')
  mobile: string;
}
