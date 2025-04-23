import { Controller, Get, Post, Body } from "@nestjs/common";
import { ApiPagination, AuthUid, Pagination } from "@common/decorators";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { SearchService } from "../services";
import { SearchDto } from "../models";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @ApiOperation({ summary: "Perform a search (Pin or Profile)" })
  @ApiPagination()
  @ApiResponse({ status: 200, description: "Search results", type: [SearchDto] })
  async search(@AuthUid() accountId: DocumentId, @Body() payload: SearchDto, @Pagination() pagination: Pagination) {
    return this.searchService.search(accountId, payload, pagination);
  }

  @Get("history")
  @ApiOperation({ summary: "Retrieve a user's search history" })
  @ApiPagination()
  @ApiResponse({ status: 200, description: "List of search history records" })
  async getSearchHistory(@AuthUid() accountId: DocumentId, @Pagination() pagination: Pagination) {
    return this.searchService.getSearchHistory(accountId, pagination);
  }

  @Get("trending")
  @ApiOperation({ summary: "Get the most popular search queries" })
  @ApiPagination()
  @ApiResponse({ status: 200, description: "List of trending queries" })
  async getTrendingQueries(@Pagination() pagination: Pagination) {
    return this.searchService.getTrendingQueries(pagination);
  }
}
