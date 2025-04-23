import { z } from "zod";

export const resetPasswordSchema = z
  .object<ValidationSchema<MutatePassword<Omit<ResetPasswordRequest, "sessionId">>>>({
    otpCode: z.string({ message: "Otp code is required" }).length(6),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords must match",
        code: "custom",
      });
    }
  });
