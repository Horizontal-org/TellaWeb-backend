import { IsString, IsUUID } from 'class-validator';

export class CloseFileDto {
  @IsString()
  fileName: string;

  @IsUUID('4')
  bucket: string;
}
