import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';

@Exclude()
export class EditSelfUserDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @Expose()
  username?: string;
}
