import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Conversation extends Document<Types.ObjectId> {
  @Prop({ type: [{ type: Types.ObjectId }], ref: "Profile", minlength: 2, index: true })
  memberIds: DocumentId[];

  @Prop({ required: false })
  themeColor: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
