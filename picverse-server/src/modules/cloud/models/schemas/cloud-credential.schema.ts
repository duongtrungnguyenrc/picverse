import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { ECloudStorage } from "../../enums";

@Schema({ timestamps: true })
export class CloudCredentials extends Document<Types.ObjectId> {
  @Prop({ required: true, type: Types.ObjectId, ref: "Account" })
  accountId: Types.ObjectId;

  @Prop({ enum: Object.values(ECloudStorage) })
  storage: ECloudStorage;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop()
  expiresAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CloudCredentialsSchema = SchemaFactory.createForClass(CloudCredentials);
