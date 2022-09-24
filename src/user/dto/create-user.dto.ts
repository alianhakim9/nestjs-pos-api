import { OmitType, PickType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/auth/dto/auth.dto';
import { IsExist } from 'src/utils/validator/exists-validator';
import { IsUnique } from 'src/utils/validator/unique-validator';
import { User } from '../entities/user.entity';

export class UserDto {
  // api property : untuk swagger
  @ApiProperty({ required: true })
  @IsOptional()
  // custom decorator
  @IsExist([User, 'id'])
  id?: number;

  @ApiProperty({ required: true })
  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  nama_user: string;

  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  @IsUnique([User, 'email'])
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  // custom decorator
  @IsUnique([User, 'username'])
  username: string;

  @ApiProperty({ required: true })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
  created_at: Date;
  updated_at: Date;
  role: UserRole = UserRole.User;
}

// omit membuang id
export class CreateUserDto extends OmitType(UserDto, ['id']) {}
// pick mengambil id
export class UserIdDto extends PickType(UserDto, ['id']) {}
