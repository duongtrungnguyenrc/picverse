import { z } from "zod";

export const forgotPasswordSchema = z.object<ValidationSchema<ForgotPasswordRequest>>({
  emailOrUserName: z.union([
    z.string().email({ message: "Must be an email or user name" }),
    z.string().min(1, { message: "Must be an email or user name" }),
  ]),
});
