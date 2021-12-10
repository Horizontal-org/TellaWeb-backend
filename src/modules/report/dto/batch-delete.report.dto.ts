import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BatchDeleteReportDto {
  @ApiProperty()
  @IsArray()
  toDelete: Array<string>;
}
