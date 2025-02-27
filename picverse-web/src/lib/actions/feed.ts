"use server";

import { httpFetchClient } from "../utils";

export const loadFeed = async (pagination: Pagination): Promise<InfiniteResponse<Pin>> => {
  const page = await httpFetchClient.get<InfiniteResponse<Pin>>("/feed", {
    query: pagination,
  });

  return page;
};
