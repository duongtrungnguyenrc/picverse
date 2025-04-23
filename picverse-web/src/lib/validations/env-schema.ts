import { z } from "zod";

export const envSchema = z.object<ValidationSchema<NodeJS.ProcessEnv>>({
  NEXT_PUBLIC_API_SERVER_ORIGIN: z.string({
    message: "Environment variable NEXT_PUBLIC_API_SERVER_ORIGIN is required",
  }),
  NEXT_PUBLIC_ACCESS_TOKEN_PREFIX: z.string({
    message: "Environment variable NEXT_PUBLIC_ACCESS_TOKEN_PREFIX is required",
  }),
  NEXT_PUBLIC_REFRESH_TOKEN_PREFIX: z.string({
    message: "Environment variable NEXT_PUBLIC_REFRESH_TOKEN_PREFIX is required",
  }),
  NEXT_PUBLIC_ENCRYPT_SECRET: z.string({ message: "Environment variable NEXT_PUBLIC_ENCRYPT_SECRET is required" }),
  NEXT_PUBLIC_ENCRYPT_ALGORITHM: z.string({
    message: "Environment variable NEXT_PUBLIC_ENCRYPT_ALGORITHM is required",
  }),
  NODE_ENV: z.enum(["development", "production", "test"], {
    message: "Environment variable NODE_ENV is required and must be one of 'development', 'production', or 'test'",
  }),
  NEXT_PUBLIC_CLOUDINARY_API_BASE_URL: z.string({
    message: "Environment variable NEXT_PUBLIC_CLOUDINARY_API_BASE_URL is required",
  }),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string({
    message: "Environment variable NEXT_PUBLIC_CLOUDINARY_API_KEY is required",
  }),
  NEXT_PUBLIC_CLOUDINARY_API_SECRET: z.string({
    message: "Environment variable NEXT_PUBLIC_CLOUDINARY_API_SECRET is required",
  }),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string({
    message: "Environment variable NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is required",
  }),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string({
    message: "Environment variable NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required",
  }),
});
