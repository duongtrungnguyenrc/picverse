import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { EInboxConfig } from "../enums";

@Schema({ timestamps: true })
export class Account extends Document<Types.ObjectId> {
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop({ unique: true, required: false })
  userName?: string;

  @Prop({ required: true, select: false, default: "default" })
  password: string;

  @Prop({ default: true })
  allowNotify: boolean;

  @Prop({ type: String, enum: EInboxConfig, default: EInboxConfig.ALL, select: false })
  inboxConfig: EInboxConfig;

  @Prop({ default: true, select: false })
  allowComment: boolean;

  @Prop({ default: true, select: false })
  allowEmail: boolean;

  @Prop({ required: false, select: false })
  twoFASecret?: string;

  @Prop({ default: false, select: false })
  enable2FA: boolean;

  @Prop({ default: true, select: false })
  isActive: boolean;

  @Prop({ type: Date })
  createdAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
