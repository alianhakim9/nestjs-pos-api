import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  username: string;

  @ApiProperty({ required: true })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  SUPER_ADMIN = "super-admin"
}
