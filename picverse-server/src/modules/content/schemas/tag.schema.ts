import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Tag extends Document<Types.ObjectId> {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
