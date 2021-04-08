import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

@Exclude()
export class PaginatedDto<TData> {
  @ApiProperty()
  @IsNumber()
  @Expose()
  total: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  limit: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  offset: number;

  results: TData[];
}
