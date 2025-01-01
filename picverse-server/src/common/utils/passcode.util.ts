import { genSalt, hash } from "bcrypt";

import { OTP_LENGTH } from "@common/constants";

export async function hashPassword(password: string): Promise<string> {
  const salt: string = await genSalt(10);
  return await hash(password, salt);
}

export function generateOtp(): string {
  return Array.from({ length: OTP_LENGTH }, () => Math.floor(Math.random() * 10)).join("");
}
