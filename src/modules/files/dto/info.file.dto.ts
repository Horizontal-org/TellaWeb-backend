import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';

@Exclude()
export class InfoFileDto {
  @Expose()
  @IsNumber()
  size: number;

  @Expose()
  @IsBoolean()
  exist = false;

  @Expose()
  @IsBoolean()
  closed = false;
}
