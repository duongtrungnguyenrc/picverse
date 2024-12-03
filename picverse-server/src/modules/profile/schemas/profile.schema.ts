import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { Account } from "../../account/schemas/account.schema";

@Schema({ timestamps: true })
export class Profile extends Document<Types.ObjectId> {
  @Prop({ type: Types.ObjectId, ref: "Account" })
  account: Account;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birth: Date;

  @Prop()
  gender: string;

  @Prop()
  phone: string;

  @Prop()
  profilePicture: string;

  @Prop()
  bio: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
