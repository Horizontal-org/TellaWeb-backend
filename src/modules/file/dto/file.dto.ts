import { Exclude, Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class FileDto {
  @ApiProperty()
  @Expose()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  fileName: string;

  @ApiProperty()
  @Expose()
  @IsString()
  bucket: string;
}
