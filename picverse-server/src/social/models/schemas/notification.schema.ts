import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { ENotificationType } from "../enums";
import { Account } from "@modules/account";
import { Profile } from "@modules/profile";

@Schema({ timestamps: true })
export class Notification extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  account: Account;

  @Prop({ type: Types.ObjectId, ref: "Profile", required: false })
  from?: Profile;

  @Prop({ required: true, enum: ENotificationType })
  type: ENotificationType;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Date })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
