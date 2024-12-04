import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Account } from "@modules/accounts";

@Schema({ timestamps: true })
export class Follow extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  follower: Account;

  @Prop({ type: Types.ObjectId, ref: "Account" })
  following: Account;

  @Prop({ type: Date })
  createdAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
