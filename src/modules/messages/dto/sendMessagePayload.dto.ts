import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';

export class SendMessagePayloadDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  receiver: string;
}
