import { ApiResponseProperty } from "@nestjs/swagger";

import { ECloudStorage } from "../..";

export class GetStorageLinkStatusResponseDto implements Record<ECloudStorage, boolean> {
  @ApiResponseProperty()
  local: boolean = false;

  @ApiResponseProperty()
  drive: boolean = false;

  @ApiResponseProperty()
  dropbox: boolean = false;
}
