import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { EGender } from "@modules/profile";

export class SignUpRequestDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  birth: string;

  @ApiProperty()
  @IsEnum(EGender)
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber("VN")
  phone: string;
}
