import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Conversation, ConversationSchema, Message, MessageSchema } from "./schemas";
import { ChatService, ConversationService } from "./services";
import { ChatGateway } from "./gateways";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [ChatService, ConversationService, ChatGateway],
})
export class ChatModule {}
