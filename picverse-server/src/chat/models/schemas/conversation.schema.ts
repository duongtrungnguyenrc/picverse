import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { IConversation } from "../types";

@Schema()
export class Conversation extends Document<Types.ObjectId> implements IConversation {
  @Prop({ type: [{ type: Types.ObjectId }], ref: "Profile", minlength: 2, index: true })
  members: DocumentId[];

  @Prop({ required: false })
  themeColor: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
