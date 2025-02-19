import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Session extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: DocumentId;

  @Prop({ default: true })
  activating: boolean;

  @Prop({ type: Date })
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
