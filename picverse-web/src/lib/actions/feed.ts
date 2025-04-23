"use server";

import { BASE_URL } from "../constants";
import { httpFetchClient } from "../utils";

export const loadFeed = async (pagination: Pagination): Promise<InfiniteResponse<Pin>> => {
  const page = await httpFetchClient.get<InfiniteResponse<Pin>>("/feed", {
    query: pagination,
  });

  return page;
};

export const loadStaticFeed = async (): Promise<InfiniteResponse<Pin>> => {
  const page = await fetch(`${BASE_URL}/feed`, {
    method: "GET",
  });

  return await page.json();
};
