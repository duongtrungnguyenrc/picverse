import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Logger, UsePipes, ValidationPipe } from "@nestjs/common";
import { Server, Socket } from "socket.io";

import { CommentService, PinInteractionService } from "../services";
import { Auth, SocketAuthTokenPayload } from "@common/decorators";
import { CreatePinCommentDto, EInteractionType } from "../models";
import { JWTSocketAuthGuard } from "@common/guards";

@WebSocketGateway({ namespace: "pin-interaction", transports: ["websocket"] })
@UsePipes(new ValidationPipe({ exceptionFactory: (errors) => new WsException(errors) }))
export class PinInteractionGateway {
  @WebSocketServer() private server: Server;
  private readonly logger: Logger = new Logger(PinInteractionGateway.name);

  constructor(
    private readonly commentService: CommentService,
    private readonly pinInteractionService: PinInteractionService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.debug(`Client ${client.id} connected`);
  }

  @SubscribeMessage("listen")
  async onListenPinComment(@ConnectedSocket() client: Socket, @MessageBody() pinId: DocumentId) {
    await client.join(pinId.toString());
    this.logger.debug(`Client: ${client.id} listening... for pin ${pinId}`);
  }

  @SubscribeMessage("comment")
  @Auth(JWTSocketAuthGuard)
  createComment(@SocketAuthTokenPayload("uid") accountId: DocumentId, @MessageBody() payload: CreatePinCommentDto) {
    this.commentService
      .createComment(accountId, payload)
      .then((createdComment) => {
        this.server.to(payload.pinId.toString()).emit("new-comment", createdComment);

        this.pinInteractionService.createInteraction({
          accountId,
          pinId: payload.pinId,
          type: EInteractionType.COMMENT,
        });
      })
      .catch((error) => {
        this.server.to(payload.pinId.toString()).emit("comment-error", error.toString());
      });
  }

  @SubscribeMessage("like")
  @Auth(JWTSocketAuthGuard)
  createLike(@SocketAuthTokenPayload("uid") accountId: DocumentId, @MessageBody() pinId: string) {
    // this.commentService
    //   .createComment(accountId, payload)
    //   .then((createdComment) => {
    //     this.server.to(payload.pinId.toString()).emit("new-comment", createdComment);
    //     this.pinInteractionService.create({
    //       accountId,
    //       pinId: payload.pinId,
    //       type: EInteractionType.COMMENT,
    //     });
    //   })
    //   .catch((error) => {
    //     this.server.to(payload.pinId.toString()).emit("comment-error", error.toString());
    //   });
  }
}
