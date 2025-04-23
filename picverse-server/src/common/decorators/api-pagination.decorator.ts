import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export const ApiPagination = () => {
  return applyDecorators(
    ApiQuery({ type: Number, name: "page", description: "Current index", required: true }),
    ApiQuery({ type: Number, name: "limit", description: "Page item limit", required: false }),
  );
};
