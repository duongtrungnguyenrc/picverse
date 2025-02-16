import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ESearchTarget } from "../../enums";

export class SearchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty()
  @IsEnum(ESearchTarget)
  target?: ESearchTarget;
}
