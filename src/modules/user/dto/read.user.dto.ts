import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';

import { RolesUser } from '../domain';

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsUUID('4')
  id: string;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsEnum(RolesUser)
  role: RolesUser;
}
