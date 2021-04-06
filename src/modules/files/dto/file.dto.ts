import { Exclude, Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

@Exclude()
export class FileDto {
  @Expose()
  @IsUUID('4')
  id: string;

  @Expose()
  @IsString()
  fileName: string;

  @Expose()
  @IsString()
  bucket: string;
}
