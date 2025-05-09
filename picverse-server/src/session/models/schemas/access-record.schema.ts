import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class AccessRecord extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Session" })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: Types.ObjectId;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  browserName: string;

  @Prop()
  location: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const AccessRecordSchema = SchemaFactory.createForClass(AccessRecord);
