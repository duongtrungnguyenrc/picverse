import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class SearchRecord extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  accountId: DocumentId;

  @Prop()
  query: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const SearchRecordSchema = SchemaFactory.createForClass(SearchRecord);
