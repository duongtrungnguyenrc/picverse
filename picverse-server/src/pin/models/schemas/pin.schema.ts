import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Model, Types } from "mongoose";

import { Resource } from "@modules/cloud";
import { generateUniqueSlug } from "@modules/common/utils";

@Schema({ timestamps: true })
export class Pin extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  authorId: DocumentId;

  @Prop({ type: Types.ObjectId, ref: "Board" })
  boardId: DocumentId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: "Resource" })
  resource: Resource | DocumentId;

  @Prop({ type: [String] })
  tags: Array<string>;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: true })
  allowComment: boolean;

  @Prop({ default: true })
  allowShare: boolean;

  @Prop({ type: String, select: false })
  vectorId: string;

  @Prop({ type: String, unique: true })
  seoName: string;

  @Prop({ select: false })
  textEmbedding: number[];

  @Prop({ select: false })
  imageEmbedding: number[];

  @Prop({ type: Date })
  createdAt: Date;
}

export const PinSchema = SchemaFactory.createForClass(Pin);

PinSchema.pre<Pin>("save", async function (next) {
  if (this.isModified("title") || this.isNew) {
    this.seoName = await generateUniqueSlug(this.constructor as Model<Pin>, this.title);
  }
  next();
});
