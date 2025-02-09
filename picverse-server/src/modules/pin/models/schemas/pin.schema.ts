import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Tag } from "./tag.schema";

@Schema({ timestamps: true })
export class Pin extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Profile", select: false })
  profileId: DocumentId;

  @Prop({ type: Types.ObjectId, ref: "Board", select: false })
  boardId: DocumentId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId }], ref: "Resource" })
  resources: Array<DocumentId>;

  @Prop({ type: [{ type: Types.ObjectId }], ref: "Tag" })
  tags: Array<Tag>;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: true })
  allowComment: boolean;

  @Prop({ default: true })
  allowShare: boolean;

  @Prop({ type: Date })
  createdAt: Date;
}

export const PinSchema = SchemaFactory.createForClass(Pin);
