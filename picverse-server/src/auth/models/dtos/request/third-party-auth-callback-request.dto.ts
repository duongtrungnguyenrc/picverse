import { ApiProperty } from "@nestjs/swagger";

export class ThirdPartyAuthCallbackDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  scope: string;
}
