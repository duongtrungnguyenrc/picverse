import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { Server, Socket } from "socket.io";

import { Auth, SocketAuthTokenPayload } from "@common/decorators";
import { JWTSocketAuthGuard } from "@common/guards";
import { CreatePinCommentDto } from "../dtos";
import { CommentService } from "../services";

@WebSocketGateway({ namespace: "comment", transports: ["websocket"] })
@UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new WsException(errors) }))
export class CommentGateway {
  @WebSocketServer() private server: Server;
  private readonly logger: Logger = new Logger(CommentGateway.name);

  constructor(private readonly commentService: CommentService) {}

  handleConnection(client: Socket) {
    this.logger.debug(`Client ${client.id} connected`);
  }

  @SubscribeMessage("listen")
  @Auth(JWTSocketAuthGuard)
  async onListenPinComment(@ConnectedSocket() client: Socket, @SocketAuthTokenPayload("pid") profileId: DocumentId, @MessageBody() pinId: DocumentId) {
    await client.join(pinId.toString());
    this.logger.debug(`profile: ${profileId} listening... for ${pinId}`);
  }

  @SubscribeMessage("create")
  @Auth(JWTSocketAuthGuard)
  createComment(@SocketAuthTokenPayload("pid") profileId: DocumentId, @MessageBody() payload: CreatePinCommentDto) {
    this.commentService
      .create({
        profileId,
        ...payload,
      })
      .then((createdComment) => {
        this.server.emit("created", createdComment);
      })
      .catch((error) => {
        this.server.to(payload.pinId.toString()).emit("error", error.toString());
      });
  }
}
