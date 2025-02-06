import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { Socket, Server } from "socket.io";

import { Auth, SocketAuthTokenPayload } from "@common/decorators";
import { getSocketTokenPayload } from "@common/utils";
import { JWTSocketAuthGuard } from "@common/guards";
import { Conversation } from "../schemas";
import { ChatService } from "../services";
import { SendMessageDto } from "../dtos";

@WebSocketGateway({ namespace: "chat", transports: ["websocket"] })
@UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new WsException(errors) }))
@Auth(JWTSocketAuthGuard)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly connectedClients = new Map<string, string>();

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    const profileId: DocumentId = getSocketTokenPayload(client, "pid") as DocumentId;

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
  async sendMessage(@SocketAuthTokenPayload("pid") senderProfileId: DocumentId, @MessageBody() payload: SendMessageDto) {
    const conversation: Conversation = await this.chatService.getOrCreateConversation(senderProfileId, payload.receiverId);

    const createdMessage = await this.chatService.createMessage({
      senderId: senderProfileId,
      conversationId: conversation._id,
      content: payload.content,
    });

    conversation.members.forEach((memberId) => {
      const connectedClientEntries = Array.from(this.connectedClients.entries());
      const receiverClientId: string = connectedClientEntries.find(([_, id]) => id === memberId.toString())?.[0];

      if (receiverClientId) {
        this.server.to(receiverClientId).emit("message", createdMessage);
      }
    });

    return createdMessage;
  }
}
