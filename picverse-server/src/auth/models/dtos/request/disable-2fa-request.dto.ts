import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Disable2faDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otpCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
