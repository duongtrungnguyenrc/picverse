import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { Socket, Server } from "socket.io";

import { Auth, SocketAuthTokenPayload } from "@common/decorators";
import { ChatService, ConversationService } from "../services";
import { getSocketTokenPayload } from "@common/utils";
import { JWTSocketAuthGuard } from "@common/guards";
import { SendMessageDto } from "../dtos";

@WebSocketGateway({ namespace: "chat", transports: ["websocket"] })
@UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new WsException(errors) }))
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly connectedClients = new Map<string, string>();

  constructor(
    private readonly chatService: ChatService,
    private readonly conversationService: ConversationService,
  ) {}

  handleConnection(client: Socket) {
    const profileId: DocumentId = getSocketTokenPayload(client, "pid") as DocumentId;

    if (!profileId) {
      client.emit("error", "Unauthorized");
      client.disconnect();
      return;
    }

    this.connectedClients.set(client.id, profileId.toString());
    console.log(`Client connected: ${client.id} -> ${profileId}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("send")
  @Auth(JWTSocketAuthGuard)
  async sendMessage(@SocketAuthTokenPayload("pid") senderProfileId: DocumentId, @MessageBody() payload: SendMessageDto) {
    const conversation = await this.conversationService.find({
      memberIds: {
        $all: [senderProfileId, payload.receiverId],
      },
    });

    if (!conversation || !conversation.memberIds.includes(senderProfileId)) {
      throw new WsException("Unauthorized or conversation not found");
    }

    const createdMessage = await this.chatService.create({
      senderId: senderProfileId,
      conversationId: conversation._id,
      content: payload.content,
    });

    conversation.memberIds.forEach((memberId) => {
      const clientId = Array.from(this.connectedClients.entries()).find(([_, id]) => id === memberId.toString())?.[0];

      if (clientId) {
        this.server.to(clientId).emit("message", createdMessage);
      }
    });

    return createdMessage;
  }
}
