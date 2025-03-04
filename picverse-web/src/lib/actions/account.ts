"use server";

import { revalidateTag } from "next/cache";
import { AccountTags } from "../constants";
import { httpFetchClient } from "../utils";

export const loadAccountConfig = async (): Promise<AccountConfig> => {
  return await httpFetchClient.get<AccountConfig>("/account/config", {
    next: {
      tags: [AccountTags.ACOUNT_CONFIG],
    },
  });
};

export const revalidateAccountConfig = async () => {
  void revalidateTag(AccountTags.ACOUNT_CONFIG);
};

export const signUp = async (payload: SignUpRequest): Promise<StatusResponse> => {
  return await httpFetchClient.post<StatusResponse>("/account/sign-up", JSON.stringify(payload));
};

export const updateAccountConfig = async (data: UpdateAccountConfigRequest): Promise<StatusResponse> => {
  const response = await httpFetchClient.put<StatusResponse>("/account/config", JSON.stringify(data));

  revalidateAccountConfig();

  return response;
};
