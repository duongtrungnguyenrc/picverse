import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Profile } from "@modules/profile";

@Schema({ timestamps: true })
export class Board extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Profile" })
  profile: Profile;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ type: Date })
  createdAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
