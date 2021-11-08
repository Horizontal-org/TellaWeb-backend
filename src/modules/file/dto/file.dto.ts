import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileType } from '../domain/file-type.file.enum';

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

  @ApiProperty()
  @Expose()
  @IsEnum(FileType)
  type: FileType;
}
