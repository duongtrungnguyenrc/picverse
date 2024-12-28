import { z } from "zod";
import { EGender } from "@app/lib/enums";

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
    birth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of birth" }),
    gender: z.nativeEnum(EGender, { message: "Gender is required" }),
    phone: z.string().regex(/^0\d{9}$/, { message: "Invalid phone number" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords must match",
        code: "custom",
      });
    }
  });
