import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TwoFactorSignInRequestDto {
  @ApiProperty()
  @IsMongoId()
  accountId: DocumentId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}
