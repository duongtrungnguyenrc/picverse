import { ECloudStorage } from "@modules/cloud/enums";
import { ApiResponseProperty } from "@nestjs/swagger";

export class GetStorageLinkStatusResponseDto implements Record<ECloudStorage, boolean> {
  @ApiResponseProperty()
  local: boolean = false;

  @ApiResponseProperty()
  drive: boolean = false;

  @ApiResponseProperty()
  dropbox: boolean = false;
}
