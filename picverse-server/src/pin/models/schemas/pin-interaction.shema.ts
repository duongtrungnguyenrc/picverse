import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { EInteractionType } from "../enums";

@Schema({ timestamps: true })
export class PinInteraction extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: DocumentId;

  @Prop({ type: Types.ObjectId, ref: "Pin" })
  pinId: DocumentId;

  @Prop({ type: String, enum: EInteractionType })
  type: EInteractionType;

  @Prop({ type: Date })
  createdAt: Date;
}

export const PinInteractionSchema = SchemaFactory.createForClass(PinInteraction);
