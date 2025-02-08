import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { Socket, Server } from "socket.io";

import { Auth, SocketAuthTokenPayload } from "@common/decorators";
import { getSocketTokenPayload } from "@common/utils";
import { JWTSocketAuthGuard } from "@common/guards";
import { ChatService } from "../services";
import { SendMessageDto } from "../models";

@WebSocketGateway({ namespace: "chat", transports: ["websocket"] })
@UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new WsException(errors) }))
@Auth(JWTSocketAuthGuard)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly connectedClients = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const profileId: DocumentId = getSocketTokenPayload(client, "uid") as DocumentId;

    if (!profileId) {
      client.emit("error", "Unauthorized");
      client.disconnect();
      return;
    }

    const conversations = await this.chatService.getUserConversations(profileId);

    client.emit("conversations", conversations);

    this.connectedClients.set(client.id, profileId.toString());
    console.log(`Client connected: ${client.id} -> ${profileId}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("send")
  async sendMessage(@SocketAuthTokenPayload("uid") senderId: DocumentId, @MessageBody() payload: SendMessageDto) {
    if (!payload.receiverId && !payload.conversationId) throw new WsException("Invalid conversation");

    const { message, conversation, isNewConversation } = await this.chatService.sendMessage(senderId, payload);

    conversation?.members.forEach((memberId) => {
      if (!memberId) return;

      const connectedClientEntries = Array.from(this.connectedClients.entries());
      const receiverClientId: string = connectedClientEntries.find(([_, id]) => id === memberId.toString())?.[0];

      if (receiverClientId) {
        if (isNewConversation) {
          this.server.to(receiverClientId).emit("new-conversation", conversation);
        }

        this.server.to(receiverClientId).emit("message", message);
      }
    });
  }
}
