import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { AccessRecordService } from "./access-record.service";
import { JwtRefreshService } from "@modules/jwt-refresh";
import { JwtAccessService } from "@modules/jwt-access";
import { CacheService } from "@modules/cache";
import { Repository } from "@common/utils";
import { Session } from "../schemas";

@Injectable()
export class SessionService extends Repository<Session> {
  constructor(
    @InjectModel(Session.name) SessionModel: Model<Session>,
    private readonly acessRecordService: AccessRecordService,
    private readonly jwtAccessService: JwtAccessService,
    private readonly jwtRefreshService: JwtRefreshService,
    cacheService: CacheService,
  ) {
    super(SessionModel, cacheService);
  }

  async createSession(accountId: DocumentId, profileId: DocumentId, ipAddress: string, requestAgent: RequestAgent, sessionId: string = ""): Promise<TokenPair> {
    const session = (await this.find(sessionId)) || (await this.create({ accountId }));

    this.acessRecordService.create({
      accountId,
      sessionId: session._id,
      ipAddress,
      browserName: requestAgent.browserInfo,
    });

    const sessionPayload: JwtSessionPayload = { uid: accountId, pid: profileId, sid: session._id.toString() };

    const [accessToken, refreshToken] = await Promise.all([this.jwtAccessService.generateToken(sessionPayload), this.jwtRefreshService.generateToken(sessionPayload)]);

    return { accessToken, refreshToken };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await Promise.all([this.jwtAccessService.revoke(sessionId.toString()), this.jwtRefreshService.revoke(sessionId.toString()), this.update(sessionId, { activating: false })]);
  }

  async revokeAllSession(accountId: DocumentId, ignore: Array<DocumentId> = []): Promise<void> {
    const sessions = await this.findMultiple({ accountId, _id: { $nin: ignore } });

    await Promise.all(
      sessions.flatMap((session) => {
        const sid = session._id.toString();
        return [this.jwtAccessService.revoke(sid), this.jwtRefreshService.revoke(sid), this.update(sid, { activating: false })];
      }),
    );
  }

  async refreshSession(refreshToken: string, ipAddress: string, requestAgent: RequestAgent): Promise<TokenPair> {
    const decodedToken = this.jwtRefreshService.decodeToken(refreshToken);

    if (!decodedToken || !decodedToken.sid) {
      throw new NotAcceptableException("Invalid refresh token");
    }

    const session = await this.find({ _id: decodedToken.sid, activating: true }, { force: true });

    if (!session) {
      throw new NotAcceptableException("Session not found or expired");
    }

    return this.createSession(decodedToken.uid, decodedToken.pid, ipAddress, requestAgent, decodedToken.sid);
  }
}
