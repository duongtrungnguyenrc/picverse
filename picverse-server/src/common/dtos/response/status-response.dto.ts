import { ApiResponseProperty } from "@nestjs/swagger";

export class StatusResponseDto {
  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  code?: number;
}
