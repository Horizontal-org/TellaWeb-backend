import { IsString, IsUUID } from 'class-validator';

export class ReadFileDto {
  @IsUUID(4)
  bucket: string;

  @IsString()
  fileName: string;
}
