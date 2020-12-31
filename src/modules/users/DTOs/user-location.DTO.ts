import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserLocationDTO {
  @Transform(latitude => parseFloat(latitude))
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @Transform(longitude => parseFloat(longitude))
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}
