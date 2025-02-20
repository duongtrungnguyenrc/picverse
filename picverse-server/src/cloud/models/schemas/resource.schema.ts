import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

import { ECloudStorage, EResourceType } from "../enums";

@Schema({ timestamps: true })
export class Resource extends Document<DocumentId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: DocumentId;

  @Prop({ required: false, unique: true })
  referenceId?: string;

  @Prop({ default: null })
  parentId: string | null;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: Object.values(EResourceType) })
  type: EResourceType;

  @Prop({ required: true, enum: Object.values(ECloudStorage), default: ECloudStorage.LOCAL })
  storage: ECloudStorage;

  @Prop({ default: 0 })
  size: number;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  mimeType: string;

  @Prop({ default: true })
  isPrivate: boolean;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
