import { PipelineStage, Types } from "mongoose";
import { Injectable } from "@nestjs/common";

import { CalculatedConversation, SendMessageDto, Message } from "../models";
import { ConversationService } from "./conversation.service";
import { MessageService } from "./message.service";

@Injectable()
export class ChatService {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  async getUserConversations(accountId: DocumentId): Promise<Array<CalculatedConversation>> {
    const conversations = await this.conversationService.getModel().aggregate([
      {
        $match: {
          members: accountId,
        },
      },
      ...this.queryConversations(accountId),
    ]);

    return conversations;
  }

  async sendMessage(
    senderId: DocumentId,
    payload: SendMessageDto,
    isNewConversation?: boolean,
  ): Promise<{ message: Message; conversation?: CalculatedConversation; isNewConversation?: boolean }> {
    const memberIds = [senderId, payload.receiverId];

    const [existingConversation] = await this.conversationService.getModel().aggregate([
      {
        $match: {
          $or: [
            {
              _id: new Types.ObjectId(payload.conversationId),
            },
            {
              members: {
                $all: memberIds,
              },
            },
          ],
        },
      },
      ...this.queryConversations(senderId),
    ]);

    if (existingConversation) {
      return {
        message: isNewConversation
          ? existingConversation.lastMessage
          : await this.messageService.create({
              senderId: new Types.ObjectId(senderId),
              conversationId: existingConversation._id,
              content: payload.content,
            }),
        conversation: existingConversation,
        isNewConversation,
      };
    }

    const newConversation = await this.conversationService.create({
      members: memberIds,
    });

    await this.messageService.create({
      senderId: new Types.ObjectId(senderId),
      conversationId: newConversation._id,
      content: payload.content,
    });

    return this.sendMessage(senderId, payload, true);
  }

  async createMessage(payload: Partial<Message>): Promise<Message> {
    return this.messageService.create(payload);
  }

  private queryConversations(accountId: DocumentId): Array<PipelineStage> {
    return [
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
        $addFields: {
          otherMemberIds: {
            $filter: {
              input: "$members",
              as: "memberId",
              cond: { $ne: ["$$memberId", accountId] },
            },
          },
        },
      },
      {
        $set: {
          otherMemberIds: {
            $map: {
              input: "$otherMemberIds",
              as: "id",
              in: { $toObjectId: "$$id" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "otherMemberIds",
          foreignField: "accountId",
          as: "otherMemberProfiles",
        },
      },
      {
        $addFields: {
          otherMemberProfiles: {
            $map: {
              input: "$otherMemberProfiles",
              as: "profile",
              in: {
                _id: "$$profile.accountId",
                firstName: "$$profile.firstName",
                lastName: "$$profile.lastName",
                avatar: "$$profile.profilePicture",
              },
            },
          },
        },
      },
      {
        $project: {
          messages: 0,
          otherMemberIds: 0,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ];
  }
}
