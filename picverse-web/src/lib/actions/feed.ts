"use server";

import { httpFetchClient } from "../utils";

export const loadFeed = async (pagination: Pagination): Promise<InfiniteResponse<Pin>> => {
  const paginationQuery = new Map<string, string>();

  Object.entries(pagination).forEach(([key, value]) => {
    if (value) paginationQuery.set(key, String(value));
  });

  const page = await httpFetchClient.get<InfiniteResponse<Pin>>("/feed", {
    query: paginationQuery,
  });

  console.log(page);

  return page;
};
