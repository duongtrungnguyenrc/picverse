"use server";

import { httpFetchClient } from "../utils";

export const signUp = async (payload: SignUpRequest): Promise<StatusResponse> => {
  return await httpFetchClient.post<StatusResponse>("/account/sign-up", JSON.stringify(payload), {
    headers: { "Content-Type": "application/json" },
  });
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<string> => {
  const response = await httpFetchClient.post<string>("/account/forgot-password", JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });

  return response;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<StatusResponse> => {
  const response = await httpFetchClient.post<StatusResponse>("/account/reset-password", JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });

  return response;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<StatusResponse> => {
  const response = await httpFetchClient.put<StatusResponse>("/account/password", JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });

  return response;
};
