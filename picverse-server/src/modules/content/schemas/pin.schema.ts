import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Profile } from "@modules/profile";
import { Board } from "./board.schema";
import { Tag } from "./tag.schema";

@Schema({ timestamps: true })
export class Pin extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Profile" })
  profile: Profile;

  @Prop({ type: Types.ObjectId, ref: "Board" })
  board: Board;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  mediaUrl: string;

  @Prop()
  link: string;

  @Prop({ type: [{ type: Types.ObjectId }], ref: "Tag" })
  tags: Array<Tag>;

  @Prop({ type: Date })
  createdAt: Date;
}

export const PinSchema = SchemaFactory.createForClass(Pin);
