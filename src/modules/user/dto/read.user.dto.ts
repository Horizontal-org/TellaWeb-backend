import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { RolesUser, UserEntity } from '../domain';

@Exclude()
export class ReadUserDto {
  @ApiProperty()
  @Expose()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  username: string;

  @ApiProperty()
  @Expose()
  @IsEnum(RolesUser)
  role: RolesUser;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly createdAt: string;

  @ApiProperty({ type: String })
  @Expose()
  note?: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  otp_active?: boolean;

  @ApiProperty()
  @Expose()
  @IsString()
  readonly deletedAt: string;

  public toEntity() {
    const user = new UserEntity();
    user.id = this.id;
    return user;
  }
}
