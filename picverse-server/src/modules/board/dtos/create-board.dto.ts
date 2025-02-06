import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  isPrivate: boolean;
}
