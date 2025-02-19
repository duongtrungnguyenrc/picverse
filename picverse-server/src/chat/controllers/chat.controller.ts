import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { AuthUid, Auth, Pagination, ApiPagination } from "@common/decorators";
import { CalculatedConversation, Message } from "../models";
import { InfiniteResponse } from "@common/dtos";
import { ChatService } from "../services";

@Controller("chat")
@ApiTags("Chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Auth()
  @Get("/conversations")
  async loadConversations(@AuthUid() accountId: DocumentId): Promise<Array<CalculatedConversation>> {
    return await this.chatService.getUserConversations(accountId);
  }

  @Auth()
  @Get("/messages/:conversationId")
  @ApiPagination()
  @ApiOkResponse({ type: InfiniteResponse<Message> })
  async loadConversationMessages(@Param("conversationId") conversationId: string, @Pagination() pagination: Pagination): Promise<InfiniteResponse<Message>> {
    return await this.chatService.getConversationMessages(conversationId, pagination);
  }
}
