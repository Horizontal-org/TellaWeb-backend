import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchDeleteUsersDto {
  @ApiProperty()
  @IsArray()
  toDelete: Array<string>;
}
