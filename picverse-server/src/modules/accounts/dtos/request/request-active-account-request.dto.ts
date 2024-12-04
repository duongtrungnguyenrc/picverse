import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RequestActiveAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emailOrUserName: string;
}
