"use server";

import { httpClient } from "../utils";

export const loadAuthAccount = async (): Promise<Account | undefined> => {
  try {
    const response = await httpClient.get<Account>("/account");

    return response.data;
  } catch (error) {
    return undefined;
  }
};
