import { IsNumber, IsString, IsIn } from 'class-validator';

export class ReadManyQueryDto {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;

  @IsString()
  sortBy: string;

  @IsIn([1, -1])
  sortOrder: 1 | -1;

  @IsString()
  search: string;
}
