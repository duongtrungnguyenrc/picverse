import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";

import { generateUniqueSlug } from "@modules/common/utils";

@Schema({ timestamps: true })
export class Board extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: DocumentId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ type: String, unique: true })
  seoName: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.pre<Board>("save", async function (next) {
  if (this.isModified("name") || this.isNew) {
    this.seoName = await generateUniqueSlug(this.constructor as Model<Board>, this.name);
  }
  next();
});
