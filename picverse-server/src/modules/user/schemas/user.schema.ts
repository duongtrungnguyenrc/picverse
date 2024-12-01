import { Schema, SchemaFactory } from "@nestjs/mongoose";

import { ApiSchemaProp } from "@common/decorators";
import { BaseSchema } from "@common/utils";

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @ApiSchemaProp({ unique: true, required: true })
  email: string;

  @ApiSchemaProp({ required: true })
  password: string;

  @ApiSchemaProp({ type: Date })
  createdAt: Date;

  @ApiSchemaProp({ type: Date })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
