import { z } from "zod";

export const signInSchema = z.object<ValidationSchema<SignInRequest>>({
  emailOrUserName: z.union([
    z.string().email({ message: "Must be an email or user name" }),
    z.string().min(1, { message: "Must be an email or user name" }),
  ]),
  password: z
    .string({
      message: "Password is required",
    })
    .min(6),
});
