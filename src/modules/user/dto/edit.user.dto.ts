import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RolesUser } from '../domain';

// The web app sends null for the fields it doesn't change; IsOptional skips them
@Exclude()
export class EditUserDto {
  @IsOptional()
  @IsUUID('4')
  @Expose()
  id?: string;

  // set by the server only: without a validator, the whitelist strips it from request bodies
  @ApiProperty({ type: Boolean })
  @Expose()
  isAdmin?: boolean;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @Expose()
  password?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @Length(6, 60)
  @Expose()
  username?: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Expose()
  note?: string;

  @ApiProperty({ enum: RolesUser })
  @IsOptional()
  @IsEnum(RolesUser)
  @Expose()
  role?: RolesUser;

  // set by the server only, as isAdmin
  @ApiProperty({ type: Date })
  @Expose()
  deletedAt?: Date;
}
