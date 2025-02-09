import { z } from "zod";

export const createBoardSchema = z.object<ValidationSchema<CreateBoardRequest>>({
  name: z.string().min(1, { message: "Board name can not be empty" }),
  description: z.string().min(1, { message: "Board description can not be empty" }),
  isPrivate: z.boolean(),
});
