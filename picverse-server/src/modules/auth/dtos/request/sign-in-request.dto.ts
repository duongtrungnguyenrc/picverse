import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emailOrUserName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
