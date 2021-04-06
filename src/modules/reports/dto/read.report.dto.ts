import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

import { FileEntity } from 'modules/files/domain';
import { UserEntity } from 'modules/user/domain/user.entity';

@Exclude()
export class ReadReportDto {
  @Expose()
  @IsUUID('4')
  id: string;

  @Expose()
  @IsString()
  readonly title: string;

  @Expose()
  @IsString()
  readonly description: string;

  @Expose()
  @Type(() => FileEntity)
  files: FileEntity[];

  @Expose()
  @Type(() => UserEntity)
  author: UserEntity;
}
