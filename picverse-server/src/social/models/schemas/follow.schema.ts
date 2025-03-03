import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class Follow extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  followerId: DocumentId;

  @Prop({ type: Types.ObjectId, ref: "Account" })
  followingId: DocumentId;

  @Prop({ type: Date })
  createdAt: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
