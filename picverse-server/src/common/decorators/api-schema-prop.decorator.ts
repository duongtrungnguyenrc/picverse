import { ApiPropertyOptions, ApiResponseProperty } from "@nestjs/swagger";
import { Prop, PropOptions } from "@nestjs/mongoose";
import { applyDecorators } from "@nestjs/common";

export const ApiSchemaProp = (schemaPropertyOptions?: PropOptions, apiPropertyOptions?: ApiPropertyOptions) => {
  return applyDecorators(ApiResponseProperty(apiPropertyOptions), Prop(schemaPropertyOptions));
};
