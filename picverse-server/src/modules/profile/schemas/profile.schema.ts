import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { EGender } from "../enums";

@Schema({ timestamps: true })
export class Profile extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account", select: false })
  accountId: DocumentId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false })
  birth: Date;

  @Prop({ type: String, enum: EGender, required: false })
  gender: string;

  @Prop({ required: false })
  phone: string;

  @Prop({ required: false })
  profilePicture: string;

  @Prop({ required: false, maxlength: 50 })
  bio: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
