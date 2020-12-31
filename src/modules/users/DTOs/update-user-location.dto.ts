import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserLocationDTO {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
