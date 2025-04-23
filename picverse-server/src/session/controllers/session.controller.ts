import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";

import { ApiPagination, Auth, AuthUid, Pagination } from "@common/decorators";
import { AccessRecordService } from "../services";
import { PaginationResponse } from "@common/dtos";
import { AccessRecord } from "../models";

@Controller("/session")
@ApiTags("Session")
export class SessionController {
  constructor(private readonly accessRecordService: AccessRecordService) {}

  @Auth()
  @Get("/access")
  @ApiOperation({ summary: "Get access histories" })
  @ApiPagination()
  @ApiOkResponse({ description: "Successfully to get access records. Return pagination records", type: PaginationResponse<AccessRecord> })
  async getAccessRecords(@AuthUid() accountId: DocumentId, @Pagination() pagination: Pagination): Promise<PaginationResponse<AccessRecord>> {
    return this.accessRecordService.findMultiplePaging({ accountId }, pagination);
  }
}
