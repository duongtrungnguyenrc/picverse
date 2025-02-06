import { Injectable } from "@nestjs/common";

import { ConversationService } from "./conversation.service";
import { MessageService } from "./message.service";
import { Conversation, Message } from "../schemas";

@Injectable()
export class ChatService {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) {}

  async getUserConversations(profileId: DocumentId): Promise<Array<Conversation & { lastMessage: Message }>> {
    const conversations: Array<Conversation & { lastMessage: Message }> = await this.conversationService.getModel().aggregate([
      {
        $match: {
          members: {
            $in: [profileId],
          },
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "conversationId",
          as: "messages",
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$messages", -1] },
        },
      },
      {
        $project: {
          messages: 0,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);

    return conversations;
  }

  async getOrCreateConversation(senderProfileId: DocumentId, receiverProfileId: DocumentId): Promise<Conversation> {
    const memberIds = [[senderProfileId, receiverProfileId]];

    return (
      (await this.conversationService.find(
        {
          members: {
            $all: memberIds,
          },
        },
        { force: true },
      )) ||
      (await this.conversationService.create({
        members: memberIds,
      }))
    );
  }

  async createMessage(payload: Partial<Message>): Promise<Message> {
    return this.messageService.create(payload);
  }
}
