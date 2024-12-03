import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Profile } from "@modules/profile";
import { Pin } from "./pin.schema";

@Schema({ timestamps: true })
export class Comment extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Profile" })
  profile: Profile;

  @Prop({ type: Types.ObjectId, ref: "Pin" })
  pin: Pin;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
