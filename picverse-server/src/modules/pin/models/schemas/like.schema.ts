import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Account } from "@modules/account";

@Schema({ timestamps: true })
export class Like extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: Account;

  @Prop({ required: true })
  pinId: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
