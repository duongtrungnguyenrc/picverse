import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { Conversation, ConversationSchema, Message, MessageSchema } from "./schemas";
import { MessageService, ConversationService, ChatService } from "./services";
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
  providers: [MessageService, ConversationService, ChatService, ChatGateway],
})
export class ChatModule {}
