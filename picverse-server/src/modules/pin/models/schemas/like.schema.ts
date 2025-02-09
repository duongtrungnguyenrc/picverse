import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Profile } from "@modules/profile";

@Schema({ timestamps: true })
export class Like extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Profile" })
  profile: Profile;

  @Prop({ required: true })
  pinId: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
