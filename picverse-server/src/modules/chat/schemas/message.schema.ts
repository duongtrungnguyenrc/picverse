import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Message extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Conversation" })
  conversationId: DocumentId;

  @Prop({ type: Types.ObjectId, ref: "Profile" })
  senderId: DocumentId;

  @Prop()
  content: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
