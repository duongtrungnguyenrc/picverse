import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Comment extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: DocumentId;

  @Prop({ type: Types.ObjectId, ref: "Pin" })
  pinId: DocumentId;

  @Prop({ type: Types.ObjectId, ref: "Comment" })
  replyFor: DocumentId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
