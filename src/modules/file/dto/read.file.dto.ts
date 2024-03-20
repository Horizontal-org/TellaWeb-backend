import { IsString, IsUUID } from 'class-validator';

export class ReadFileDto {
  @IsString()
  bucket: string;

  @IsString()
  fileName: string;
}
