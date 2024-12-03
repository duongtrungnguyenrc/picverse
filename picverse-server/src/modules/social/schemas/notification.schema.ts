import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Account } from "@modules/account";
import { NotificationType } from "../enums";

@Schema({ timestamps: true })
export class Notification extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  account: Account;

  @Prop({ required: true, enum: NotificationType, default: NotificationType.SYSTEM })
  type: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Date })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
