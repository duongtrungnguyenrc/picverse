import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Like extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: DocumentId;

  @Prop({ type: Types.ObjectId, ref: "Pin" })
  pinId: DocumentId;

  @Prop({ type: Date })
  createdAt: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
