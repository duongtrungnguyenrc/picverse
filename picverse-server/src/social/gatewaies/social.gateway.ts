import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { getSocketTokenPayload } from "@common/utils";
import { Socket, Server } from "socket.io";

@WebSocketGateway({ namespace: "social", transports: ["websocket"] })
export class SocialGateway implements OnGatewayConnection {
  @WebSocketServer()
  readonly server: Server;

  async handleConnection(client: Socket) {
    const accountId: DocumentId = getSocketTokenPayload(client, "uid") as DocumentId;

    if (!accountId) {
      client.emit("error", "Unauthorized");
      client.disconnect();
      return;
    }

    client.join(accountId.toString());

    console.log(`Client listening social: ${client.id} -> ${accountId}`);
  }
}
