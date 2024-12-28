import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Account extends Document<Types.ObjectId> {
  @Prop({ unique: true, required: true, index: true })
  email: string;

  @Prop({ unique: true, required: false })
  userName?: string;

  @Prop({ required: true, select: false, default: "default" })
  password: string;

  @Prop({ default: true })
  allowNotify: boolean;

  @Prop({ default: true })
  allowEmail: boolean;

  @Prop({ default: false })
  enableTwoFactorAuthentication: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  createdAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
