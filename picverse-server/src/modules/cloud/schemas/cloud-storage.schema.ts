import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class CloudStorage extends Document<DocumentId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: DocumentId;

  @Prop({ default: 2000 })
  totalSpace: number;

  @Prop({ default: 0 })
  usedSpace: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CloudStorageSchema = SchemaFactory.createForClass(CloudStorage);
