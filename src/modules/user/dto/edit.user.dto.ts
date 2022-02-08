import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsUUID, IsEmail } from 'class-validator';

@Exclude()
export class EditUserDto {
  @IsUUID('4')
  @Expose()
  id?: string;

  @ApiProperty({ type: Boolean })
  @Expose()
  isAdmin?: boolean;

  @ApiProperty({ type: String })
  @Expose()
  password?: string;

  @ApiProperty({ type: String })
  @IsEmail()
  @Expose()
  username?: string;

  @ApiProperty({ type: String })
  @Expose()
  note?: string;
}
