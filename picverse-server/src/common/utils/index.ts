export * from "./base-repository.util";
export * from "./jwt-handler.util";
export * from "./base-schema.util";
export * from "./logger.util"

import { ClientSession, Model, Document } from "mongoose";
import { Handshake } from "socket.io/dist/socket-types";
import { UnauthorizedException } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { decode } from "jsonwebtoken";
import { genSalt, hash } from "bcrypt";
import { Socket } from "socket.io";
import { Request } from "express";

import { AccountErrorMessage } from "@modules/account";
import { TOKEN_TYPE, OTP_LENGTH } from "../constants";
import { CacheService } from "@modules/cache";

export async function hashPassword(password: string): Promise<string> {
  const salt: string = await genSalt(10);
  return await hash(password, salt);
}

export function generateOtp(): string {
  return Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10)).join("");
}

export const multerToBlobUrl = (file: Express.Multer.File): string => {
  const blob = new Blob([file.buffer], { type: file.mimetype });
  return URL.createObjectURL(blob);
};

export async function withMutateTransaction<T extends Document, K = T>(model: Model<T>, callback: (session: ClientSession) => Promise<K> | K): Promise<K> {
  const session: ClientSession = await model.db.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    await session.endSession();
  }
}

// Handle token

export const getExpiredTime = (time: number): Date => {
  return new Date(Date.now() + time * 1000);
};

const extractAuthToken = (fullToken: string, raw: boolean = false) => {
  const [tokenType, authToken] = fullToken?.split(" ") ?? [];

  if ((!tokenType || tokenType !== TOKEN_TYPE || !authToken) && !raw) {
    throw new UnauthorizedException(AccountErrorMessage.INVALID_AUTH_TOKEN);
  }

  return authToken;
};

export const getTokenFromRequest = (request: Request, raw: boolean = false): string => {
  const fullToken = request.headers["authorization"];

  if (!fullToken && !raw) {
    if (request instanceof Request) throw new UnauthorizedException(AccountErrorMessage.INVALID_AUTH_TOKEN);
    throw new UnauthorizedException(AccountErrorMessage.INVALID_AUTH_TOKEN);
  }

  return extractAuthToken(fullToken, raw);
};

export const getTokenFromHandshake = (handshake: Handshake, raw: boolean = false): string => {
  const fullToken: string = handshake.auth.token || handshake.headers.authorization;

  if (!fullToken) {
    throw new WsException(AccountErrorMessage.INVALID_AUTH_TOKEN);
  }

  return extractAuthToken(fullToken, raw);
};

export const getSocketTokenPayload = (client: Socket, key: keyof JwtPayload) => {
  try {
    const authToken = getTokenFromHandshake(client.handshake, true);
    const decodedToken: JwtPayload = decode(authToken) as JwtPayload;

    return decodedToken?.[key];
  } catch (error) {
    return undefined;
  }
};

// cache

export const joinCacheKeys = (...segment: string[]) => {
  return [...segment].filter((key) => !!key).join(":");
};

const getCacheDefault = async <T>(service: CacheService, cacheKey: string): Promise<T | null> => {
  return await service.get<T>(cacheKey);
};

export const cacheable = async <T>(service: CacheService, action: () => Promise<T> | T, options: CacheWrapOptions<T>): Promise<T> => {
  const cacheKey: string = joinCacheKeys(...options.cacheKeys);

  const defaultCachedData: T | null = await getCacheDefault(service, cacheKey);

  const cachedData: T = options.getCacheData ? await options.getCacheData(service, cacheKey, defaultCachedData) : defaultCachedData;

  if (cachedData) {
    return cachedData;
  }

  if (cachedData[0] !== null) {
    return cachedData[0] as T;
  }

  const data = await action();

  if (data) {
    await service.set(cacheKey, data);
  }

  return data;
};
