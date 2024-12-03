import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Account } from "@modules/account";
import { EGender } from "../enums";

@Schema({ timestamps: true })
export class Profile extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  account: Account;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  birth: Date;

  @Prop({ type: String, enum: EGender, required: true })
  gender: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  profilePicture: string;

  @Prop()
  bio: string;

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
